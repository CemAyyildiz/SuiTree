import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
  TextArea,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PACKAGE_ID, MODULE_NAME, REGISTRY_ID } from "./constants";
import { Link, LinkTreeProfile } from "./types";

interface ProfileEditorProps {
  objectId?: string;
}

export function ProfileEditor(props?: ProfileEditorProps) {
  const params = useParams<{ objectId?: string }>();
  const objectId = props?.objectId || params.objectId;
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<LinkTreeProfile | null>(null);
  
  // User address from connected wallet (includes Enoki wallets)
  const userAddress = account?.address;

  // Form state
  const [title, setTitle] = useState("");
  const [avatarCid, setAvatarCid] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [links, setLinks] = useState<Link[]>([]);

  const isEditMode = !!objectId;

  useEffect(() => {
    if (isEditMode && objectId) {
      loadProfile();
    }
  }, [objectId]);

  const loadProfile = async () => {
    if (!objectId) return;

    setLoading(true);
    try {
      const response = await suiClient.getObject({
        id: objectId,
        options: {
          showContent: true,
        },
      });

      if (response.data?.content && "fields" in response.data.content) {
        const content = response.data.content as any;
        const profileData: LinkTreeProfile = {
          id: { id: response.data.objectId },
          owner: content.fields.owner,
          title: content.fields.title,
          avatar_cid: content.fields.avatar_cid,
          bio: content.fields.bio,
          links: content.fields.links || [],
          verified: content.fields.verified,
          view_count: content.fields.view_count || "0",
        };

        setProfile(profileData);
        setTitle(profileData.title);
        setAvatarCid(profileData.avatar_cid);
        setBio(profileData.bio);
        setLinks(profileData.links);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!userAddress) {
      alert("❌ Please connect your wallet first!");
      return;
    }

    setLoading(true);
    try {
      const tx = new Transaction();

      // Use mint_profile instead (simpler)
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::mint_profile`,
        arguments: [
          tx.pure.string(title),
          tx.pure.string(avatarCid),
          tx.pure.string(bio),
        ],
      });

      // Normal wallet transaction - no sponsored transactions
      console.log('🚀 Sending transaction with normal wallet...');
      
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("✅ Profile created successfully!", result.digest);
      
      // Get the created profile ID from the transaction result
      // For Sui v0.29+, we need to get the object from the transaction block
      const txBlock = await suiClient.waitForTransaction({
        digest: result.digest,
        options: {
          showObjectChanges: true,
        },
      });
      
      const createdProfile = txBlock.objectChanges?.find(
        (change: any) => change.type === 'created' && change.objectType?.includes('LinkTreeProfile')
      ) as any;
      const profileObjectId = createdProfile?.objectId;
      
      // Register username in a separate transaction if provided
      if (username.trim() && profileObjectId) {
        try {
          const tx2 = new Transaction();
          tx2.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::register_name`,
            arguments: [
              tx2.object(REGISTRY_ID),
              tx2.object(profileObjectId), // Now we have the real object ID
              tx2.pure.string(username.toLowerCase().trim()),
            ],
          });
          
          const result2 = await signAndExecuteTransaction({
            transaction: tx2,
          });
          
          console.log("✅ Username registered!", result2.digest);
          
          // Add links after username registration
          if (links.length > 0 && profileObjectId) {
            try {
              for (const link of links) {
                const tx3 = new Transaction();
                if (link.is_premium) {
                  tx3.moveCall({
                    target: `${PACKAGE_ID}::${MODULE_NAME}::add_premium_link`,
                    arguments: [
                      tx3.object(profileObjectId),
                      tx3.pure.string(link.label),
                      tx3.pure.string(link.url),
                      tx3.pure.u64(link.price),
                    ],
                  });
                } else {
                  tx3.moveCall({
                    target: `${PACKAGE_ID}::${MODULE_NAME}::add_link`,
                    arguments: [
                      tx3.object(profileObjectId),
                      tx3.pure.string(link.label),
                      tx3.pure.string(link.url),
                    ],
                  });
                }
                
                await signAndExecuteTransaction({
                  transaction: tx3,
                });
                console.log(`✅ Link added: ${link.label}`);
              }
              alert(`🎉 Profil oluşturuldu!\n\nUsername: @${username}\nLinks: ${links.length} adet eklendi\nPublic link:\n${username}.suitree.walrus.site\n\nTransaction: ${result.digest}`);
            } catch (linkError) {
              console.error("Link addition failed:", linkError);
              alert(`🎉 Profil oluşturuldu!\n\nUsername: @${username}\n⚠️ Linkler eklenemedi: ${(linkError as Error).message}\nPublic link:\n${username}.suitree.walrus.site\n\nTransaction: ${result.digest}`);
            }
          } else {
            alert(`🎉 Profil oluşturuldu!\n\nUsername: @${username}\nPublic link:\n${username}.suitree.walrus.site\n\nTransaction: ${result.digest}`);
          }
        } catch (usernameError) {
          console.error("Username registration failed:", usernameError);
          const errorMsg = (usernameError as Error).message || String(usernameError);
          if (errorMsg.includes("ENameAlreadyTaken")) {
            alert(`🎉 Profil oluşturuldu, ancak username "@${username}" zaten alınmış!\n\nTransaction: ${result.digest}`);
          } else {
            alert(`🎉 Profil oluşturuldu, ancak username kaydı başarısız: ${errorMsg}\n\nTransaction: ${result.digest}`);
          }
        }
      } else {
        if (username.trim()) {
          alert(`⚠️ Profil oluşturuldu, ancak username kaydedilemedi (profil ID bulunamadı)\n\nTransaction: ${result.digest}`);
        } else {
          alert(`🎉 Profil oluşturuldu!\n\nTransaction: ${result.digest}`);
        }
      }
      
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error creating profile:", error);
      const errorMsg = (error as Error).message || String(error);
      
      if (errorMsg.includes("ENameAlreadyTaken")) {
        alert("❌ Username zaten kullanılıyor! Başka bir tane seçin.");
      } else {
        alert(`❌ Profil oluşturulamadı: ${errorMsg}`);
      }
      
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!objectId || !userAddress) return;

    setLoading(true);
    try {
      const tx = new Transaction();

      // Update title
      if (title !== profile?.title) {
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::update_title`,
          arguments: [tx.object(objectId), tx.pure.string(title)],
        });
      }

      // Update avatar
      if (avatarCid !== profile?.avatar_cid) {
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::update_avatar`,
          arguments: [tx.object(objectId), tx.pure.string(avatarCid)],
        });
      }

      // Update bio
      if (bio !== profile?.bio) {
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::update_bio`,
          arguments: [tx.object(objectId), tx.pure.string(bio)],
        });
      }


      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Profile updated successfully!", result);
            alert("Profile updated successfully!");
            navigate("/");
          },
          onError: (error) => {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleAddLink = async (isPremium = false) => {
    const label = prompt("Enter link label:");
    const url = prompt("Enter URL:");

    if (!label || !url) return;

    let price = "0";
    if (isPremium) {
      const priceInSui = prompt("Enter price in SUI (e.g., 0.1):");
      if (!priceInSui) return;
      // Convert SUI to MIST (1 SUI = 1_000_000_000 MIST)
      price = String(parseFloat(priceInSui) * 1_000_000_000);
    }

    if (!objectId) {
      // In create mode, just add to local state
      setLinks([...links, { label, url, is_premium: isPremium, price }]);
      return;
    }

    setLoading(true);
    try {
      const tx = new Transaction();

      const targetFunction = isPremium ? "add_premium_link" : "add_link";
      const args = isPremium
        ? [
            tx.object(objectId),
            tx.pure.string(label),
            tx.pure.string(url),
            tx.pure.u64(price),
          ]
        : [
            tx.object(objectId),
            tx.pure.string(label),
            tx.pure.string(url),
          ];

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${targetFunction}`,
        arguments: args,
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            console.log("Link added successfully!");
            loadProfile();
          },
          onError: (error) => {
            console.error("Error adding link:", error);
            alert("Failed to add link");
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleUpdateLink = async (index: number) => {
    if (!objectId) return;

    const label = prompt("Enter new label:", links[index].label);
    const url = prompt("Enter new URL:", links[index].url);

    if (!label || !url) return;

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::update_link`,
        arguments: [
          tx.object(objectId),
          tx.pure.u64(index),
          tx.pure.string(label),
          tx.pure.string(url),
        ],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            console.log("Link updated successfully!");
            loadProfile();
          },
          onError: (error) => {
            console.error("Error updating link:", error);
            alert("Failed to update link");
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleRemoveLink = async (index: number) => {
    if (!objectId) {
      // In create mode, just remove from local state
      setLinks(links.filter((_, i) => i !== index));
      return;
    }

    if (!confirm("Are you sure you want to remove this link?")) return;

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::remove_link`,
        arguments: [tx.object(objectId), tx.pure.u64(index)],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Link removed successfully!", result);
            loadProfile();
            setLoading(false);
          },
          onError: (error) => {
            console.error("Error removing link:", error);
            alert("Failed to remove link: " + (error.message || "Unknown error"));
            setLoading(false);
          },
        }
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert("Failed to remove link: " + (error.message || "Unknown error"));
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!objectId || !userAddress) return;

    if (!confirm("⚠️ Bu profili tamamen silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!")) return;

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::delete_profile`,
        arguments: [tx.object(objectId)],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Profile deleted successfully!", result);
            alert("✅ Profil başarıyla silindi!");
            navigate("/");
          },
          onError: (error) => {
            console.error("Error deleting profile:", error);
            alert("❌ Profil silinemedi: " + (error as Error).message);
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Profil silinemedi: " + (error as Error).message);
      setLoading(false);
    }
  };

  if (!userAddress) {
    return (
      <Container size="2" mt="9">
        <Card>
          <Text>Please connect your wallet to continue (including Google via Enoki)</Text>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="2" mt="5">
      <Flex direction="column" gap="4">
        <Flex justify="between" align="center">
          <Heading size="6">
            {isEditMode ? "Edit Profile" : "Create New Profile"}
          </Heading>
          <Button variant="soft" onClick={() => navigate("/")}>
            Cancel
          </Button>
        </Flex>

        <Card>
          <Flex direction="column" gap="4">
            <Box>
              <Text size="2" weight="bold" mb="1">
                Title
              </Text>
              <TextField.Root
                placeholder="Your Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Avatar (IPFS CID or URL)
              </Text>
              <TextField.Root
                placeholder="QmXXXXX... or https://..."
                value={avatarCid}
                onChange={(e) => setAvatarCid(e.target.value)}
              />
            </Box>

            <Box>
              <Text size="2" weight="bold" mb="1">
                Bio
              </Text>
              <TextArea
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </Box>

            {!isEditMode && (
              <Box>
                <Text size="2" weight="bold" mb="1">
                  Username (suitree.com/username) - Optional
                </Text>
                <TextField.Root
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                />
                <Text size="1" color="gray" mt="1">
                  Only lowercase letters and numbers. Example: suitree.com/{username || "yourname"}
                </Text>
              </Box>
            )}
          </Flex>
        </Card>


        <Card>
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center">
              <Heading size="4">Links</Heading>
              <Flex gap="2">
                <Button size="2" variant="soft" onClick={() => handleAddLink(false)}>
                  + Free Link
                </Button>
                <Button size="2" onClick={() => handleAddLink(true)}>
                  💰 Premium Link
                </Button>
              </Flex>
            </Flex>

            {links.length === 0 ? (
              <Text size="2" color="gray">
                No links yet. Add your first link!
              </Text>
            ) : (
              <Flex direction="column" gap="2">
                {links.map((link, index) => (
                  <Card key={index} style={{ 
                    border: link.is_premium ? "2px solid gold" : undefined 
                  }}>
                    <Flex justify="between" align="center">
                      <Flex direction="column" gap="1">
                        <Flex align="center" gap="2">
                          <Text weight="bold">{link.label}</Text>
                          {link.is_premium && (
                            <Text size="1" style={{ 
                              background: "gold", 
                              color: "black", 
                              padding: "2px 6px", 
                              borderRadius: "4px",
                              fontWeight: "bold"
                            }}>
                              💰 {(parseInt(link.price) / 1_000_000_000).toFixed(2)} SUI
                            </Text>
                          )}
                        </Flex>
                        <Text size="1" color="gray">
                          {link.url}
                        </Text>
                      </Flex>
                      <Flex gap="2">
                        {isEditMode && (
                          <Button
                            size="1"
                            variant="soft"
                            onClick={() => handleUpdateLink(index)}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          size="1"
                          variant="soft"
                          color="red"
                          onClick={() => handleRemoveLink(index)}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            )}
          </Flex>
        </Card>

        <Flex justify="end" gap="3">
          {isEditMode && (
            <Button
              size="3"
              variant="soft"
              color="red"
              onClick={handleDeleteProfile}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Profile"}
            </Button>
          )}
          <Button
            size="3"
            onClick={isEditMode ? handleUpdateProfile : handleCreateProfile}
            disabled={loading || !title}
          >
            {loading
              ? "Processing..."
              : isEditMode
              ? "Save Changes"
              : "Create Profile"}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}

