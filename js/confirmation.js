const orderId = new URLSearchParams(window.location.search).get("id");
async function loadConfirmation() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user || !orderId) {
        window.location.href = "login.html";
        return;
    }
    const { data: order, error: orderError } = await supabaseClient
        .from("order")
        .select("*")
        .eq("order_id", orderId)
        .single();
    if (orderError || !order) {
        alert("Order not found.");
        return;
    }
    const { data: items, error } = await supabaseClient
        .from("order_item")
        .select("*, product(name)")
        .eq("order_id", orderId);
    if (error) {
        alert(error.message);
        return;
    }
    document.getElementById("order-number").textContent = orderId;
    const container = document.getElementById("items");
    container.replaceChildren();
    items.forEach(item => {
        const p = document.createElement("p");
        p.textContent = `${item.product.name} × ${item.quantity} — AED ${(item.price * item.quantity).toFixed(2)}`;
        container.appendChild(p);
    });
    document.getElementById("order-total").textContent = `Total: AED ${Number(order.total).toFixed(2)}`;
}
loadConfirmation();
