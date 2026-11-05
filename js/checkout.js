// STEP 1: Get checkout form
const checkoutForm =
    document.getElementById("checkout-form");
// STEP 2: Listen for form submission
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Get customer information
    const name =
        document.getElementById("name").value.trim();
    const address =
        document.getElementById("address").value.trim();
    const phone =
        document.getElementById("phone").value.trim();
    // Validate information
    if (!name || !address) {
        alert("Name and address are required.");
        return;
    }
    if (!/^[0-9+ ]{7,15}$/.test(phone)) {
        alert("Enter a valid phone number.");
        return;
    }
    // Place order
    await placeOrder(name, address, phone);
});
// STEP 3: Create order
async function placeOrder(name, address, phone) {
    // Get logged-in user
    const { data: { user }, error: authError } =
        await supabaseClient.auth.getUser();
    if (authError || !user) {
        window.location.href = "login.html";
        return;
    }
    // Get cart from localStorage
    const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    // Calculate subtotal
    const subtotal = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );
    // Insert order into Supabase
    const { data: order, error } = await supabaseClient
        .from("order")
        .insert([{
            customer_id: user.id,
            total: subtotal,
            status: "Paid"
        }])
        .select()
        .single();
    if (error) {
        alert("Could not place order: " + error.message);
        return;
    }
    // Create order items
    const items = cart.map(item => ({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
    }));
    // Insert order items into Supabase
    const { error: itemsError } = await supabaseClient
        .from("order_item")
        .insert(items);
    if (itemsError) {
        alert("Order created, but items failed: "
              + itemsError.message);
        return;
    }
    // Clear cart
    localStorage.removeItem("cart");
    // Redirect to confirmation page
    window.location.href =
        `order-confirmation.html?id=${order.order_id}`;
}
