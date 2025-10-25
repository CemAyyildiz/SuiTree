/// Module: contrat
/// LinkTree-like profile system on Sui blockchain
module contrat::contrat;

use std::string::{String};
use sui::dynamic_field;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::balance::{Self, Balance};

// ==================== Error Codes ====================

const ENotOwner: u64 = 0;
const EInvalidIndex: u64 = 1;
const ENameAlreadyTaken: u64 = 2;
const ENameNotFound: u64 = 3;
const EInsufficientPayment: u64 = 4;
const ENotPremiumLink: u64 = 5;

// ==================== Structs ====================

/// Represents a single link in the profile
public struct Link has store, copy, drop {
    label: String,
    url: String,
    is_premium: bool,
    price: u64, // Price in MIST (1 SUI = 1_000_000_000 MIST)
}

/// Theme settings for the profile
public struct Theme has store, copy, drop {
    background_color: String,
    text_color: String,
    button_color: String,
    font_style: String,
}

/// Main LinkTree profile object
public struct LinkTreeProfile has key, store {
    id: UID,
    owner: address,
    title: String,
    avatar_cid: String,
    bio: String,
    links: vector<Link>,
    theme: Theme,
    verified: bool,
    view_count: u64,
    earnings: Balance<SUI>, // Earnings from premium links
}

/// Registry for name resolution (name -> profile object_id mapping)
/// This is a shared object that everyone can use to register and resolve names
public struct NameRegistry has key {
    id: UID,
}

/// Wrapper for storing object_id in dynamic fields
public struct ProfileReference has store, copy, drop {
    profile_id: ID,
}

/// Access record for premium links - stored as dynamic field
/// Key: (link_index, user_address)
public struct LinkAccessKey has store, copy, drop {
    link_index: u64,
    user: address,
}

public struct LinkAccess has store, copy, drop {
    granted: bool,
    paid_amount: u64,
}

// ==================== Initializer ====================

/// Initialize the module by creating a shared NameRegistry
fun init(ctx: &mut TxContext) {
    let registry = NameRegistry {
        id: object::new(ctx),
    };
    transfer::share_object(registry);
}

// ==================== Public Functions ====================

/// Create a new LinkTree profile
public fun create_profile(
    title: String,
    avatar_cid: String,
    bio: String,
    ctx: &mut TxContext
): LinkTreeProfile {
    let default_theme = Theme {
        background_color: std::string::utf8(b"#ffffff"),
        text_color: std::string::utf8(b"#000000"),
        button_color: std::string::utf8(b"#0066cc"),
        font_style: std::string::utf8(b"Arial"),
    };

    LinkTreeProfile {
        id: object::new(ctx),
        owner: ctx.sender(),
        title,
        avatar_cid,
        bio,
        links: vector::empty<Link>(),
        theme: default_theme,
        verified: false,
        view_count: 0,
        earnings: balance::zero(),
    }
}

/// Create and transfer profile to sender
public entry fun mint_profile(
    title: String,
    avatar_cid: String,
    bio: String,
    ctx: &mut TxContext
) {
    let profile = create_profile(title, avatar_cid, bio, ctx);
    transfer::transfer(profile, ctx.sender());
}

/// Register a name for a profile in the registry (Dynamic Field)
public entry fun register_name(
    registry: &mut NameRegistry,
    profile: &LinkTreeProfile,
    name: String,
    _ctx: &mut TxContext
) {
    // Check if name already exists
    assert!(!dynamic_field::exists_(&registry.id, name), ENameAlreadyTaken);
    
    // Add dynamic field: name -> ProfileReference
    let reference = ProfileReference {
        profile_id: object::id(profile),
    };
    dynamic_field::add(&mut registry.id, name, reference);
}

/// Resolve a name to a profile ID
public fun resolve_name(registry: &NameRegistry, name: String): ID {
    assert!(dynamic_field::exists_(&registry.id, name), ENameNotFound);
    let reference: &ProfileReference = dynamic_field::borrow(&registry.id, name);
    reference.profile_id
}

/// Remove name registration (only profile owner can do this indirectly)
public entry fun unregister_name(
    registry: &mut NameRegistry,
    name: String,
    _ctx: &mut TxContext
) {
    assert!(dynamic_field::exists_(&registry.id, name), ENameNotFound);
    let ProfileReference { profile_id: _ } = dynamic_field::remove(&mut registry.id, name);
}

/// Add a new link to the profile
public entry fun add_link(
    profile: &mut LinkTreeProfile,
    label: String,
    url: String,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    let link = Link { 
        label, 
        url, 
        is_premium: false, 
        price: 0 
    };
    vector::push_back(&mut profile.links, link);
}

/// Add a premium (paid) link to the profile
public entry fun add_premium_link(
    profile: &mut LinkTreeProfile,
    label: String,
    url: String,
    price: u64,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    let link = Link { 
        label, 
        url, 
        is_premium: true, 
        price 
    };
    vector::push_back(&mut profile.links, link);
}

/// Update an existing link by index
public entry fun update_link(
    profile: &mut LinkTreeProfile,
    index: u64,
    label: String,
    url: String,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    assert!(index < vector::length(&profile.links), EInvalidIndex);
    
    let link = vector::borrow_mut(&mut profile.links, index);
    link.label = label;
    link.url = url;
}

/// Update premium link price
public entry fun update_link_price(
    profile: &mut LinkTreeProfile,
    index: u64,
    new_price: u64,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    assert!(index < vector::length(&profile.links), EInvalidIndex);
    
    let link = vector::borrow_mut(&mut profile.links, index);
    assert!(link.is_premium, ENotPremiumLink);
    link.price = new_price;
}

/// Make a link premium/paid
public entry fun make_link_premium(
    profile: &mut LinkTreeProfile,
    index: u64,
    price: u64,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    assert!(index < vector::length(&profile.links), EInvalidIndex);
    
    let link = vector::borrow_mut(&mut profile.links, index);
    link.is_premium = true;
    link.price = price;
}

/// Remove a link by index
public entry fun remove_link(
    profile: &mut LinkTreeProfile,
    index: u64,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    assert!(index < vector::length(&profile.links), EInvalidIndex);
    vector::remove(&mut profile.links, index);
}

/// Update profile title
public entry fun update_title(
    profile: &mut LinkTreeProfile,
    new_title: String,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    profile.title = new_title;
}

/// Update profile avatar CID
public entry fun update_avatar(
    profile: &mut LinkTreeProfile,
    new_avatar_cid: String,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    profile.avatar_cid = new_avatar_cid;
}

/// Update profile bio
public entry fun update_bio(
    profile: &mut LinkTreeProfile,
    new_bio: String,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    profile.bio = new_bio;
}

/// Update profile theme
public entry fun update_theme(
    profile: &mut LinkTreeProfile,
    background_color: String,
    text_color: String,
    button_color: String,
    font_style: String,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    profile.theme = Theme {
        background_color,
        text_color,
        button_color,
        font_style,
    };
}

/// Increment view count (anyone can call this)
public entry fun increment_views(
    profile: &mut LinkTreeProfile,
    _ctx: &mut TxContext
) {
    profile.view_count = profile.view_count + 1;
}

/// Pay for access to a premium link
public entry fun pay_for_link_access(
    profile: &mut LinkTreeProfile,
    link_index: u64,
    payment: Coin<SUI>,
    ctx: &mut TxContext
) {
    assert!(link_index < vector::length(&profile.links), EInvalidIndex);
    
    let link = vector::borrow(&profile.links, link_index);
    assert!(link.is_premium, ENotPremiumLink);
    
    let payment_value = coin::value(&payment);
    assert!(payment_value >= link.price, EInsufficientPayment);
    
    // Add payment to profile earnings
    let payment_balance = coin::into_balance(payment);
    balance::join(&mut profile.earnings, payment_balance);
    
    // Grant access by adding dynamic field
    let access_key = LinkAccessKey {
        link_index,
        user: ctx.sender(),
    };
    
    let access = LinkAccess {
        granted: true,
        paid_amount: payment_value,
    };
    
    // If already has access, update it; otherwise add new
    if (dynamic_field::exists_(&profile.id, access_key)) {
        let existing: &mut LinkAccess = dynamic_field::borrow_mut(&mut profile.id, access_key);
        existing.paid_amount = existing.paid_amount + payment_value;
    } else {
        dynamic_field::add(&mut profile.id, access_key, access);
    };
}

/// Check if user has access to a premium link
public fun has_link_access(
    profile: &LinkTreeProfile,
    link_index: u64,
    user: address,
): bool {
    let access_key = LinkAccessKey {
        link_index,
        user,
    };
    
    if (dynamic_field::exists_(&profile.id, access_key)) {
        let access: &LinkAccess = dynamic_field::borrow(&profile.id, access_key);
        access.granted
    } else {
        false
    }
}

/// Withdraw earnings from premium links
public entry fun withdraw_earnings(
    profile: &mut LinkTreeProfile,
    ctx: &mut TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    
    let amount = balance::value(&profile.earnings);
    if (amount > 0) {
        let withdrawn = coin::take(&mut profile.earnings, amount, ctx);
        transfer::public_transfer(withdrawn, ctx.sender());
    };
}

/// Transfer profile to another address
public entry fun transfer_profile(
    profile: LinkTreeProfile,
    recipient: address,
    _ctx: &mut TxContext
) {
    transfer::transfer(profile, recipient);
}

// ==================== View Functions ====================

/// Get profile owner
public fun get_owner(profile: &LinkTreeProfile): address {
    profile.owner
}

/// Get profile title
public fun get_title(profile: &LinkTreeProfile): &String {
    &profile.title
}

/// Get profile avatar CID
public fun get_avatar_cid(profile: &LinkTreeProfile): &String {
    &profile.avatar_cid
}

/// Get profile bio
public fun get_bio(profile: &LinkTreeProfile): &String {
    &profile.bio
}

/// Get number of links
public fun get_links_count(profile: &LinkTreeProfile): u64 {
    vector::length(&profile.links)
}

/// Get link at index
public fun get_link(profile: &LinkTreeProfile, index: u64): &Link {
    vector::borrow(&profile.links, index)
}

/// Get theme
public fun get_theme(profile: &LinkTreeProfile): &Theme {
    &profile.theme
}

/// Get view count
public fun get_view_count(profile: &LinkTreeProfile): u64 {
    profile.view_count
}

/// Check if profile is verified
public fun is_verified(profile: &LinkTreeProfile): bool {
    profile.verified
}

/// Get link label
public fun get_link_label(link: &Link): &String {
    &link.label
}

/// Get link url
public fun get_link_url(link: &Link): &String {
    &link.url
}

/// Check if link is premium
public fun is_link_premium(link: &Link): bool {
    link.is_premium
}

/// Get link price
public fun get_link_price(link: &Link): u64 {
    link.price
}

/// Get profile earnings
public fun get_earnings(profile: &LinkTreeProfile): u64 {
    balance::value(&profile.earnings)
}
