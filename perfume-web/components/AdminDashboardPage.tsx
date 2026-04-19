"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  describeFirebaseOrderError,
  deleteOrder,
  observeOrders,
  updateOrderStatus,
  type StoredOrder,
} from "@/lib/firebase/orders";
import { ADMIN_EMAIL, observeAdminAuth, signOutAdmin } from "@/lib/firebase/auth";

function formatDate(value: Date | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatCurrency(value: number) {
  return `Rs ${value.toFixed(0)}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ordersRefreshCount, setOrdersRefreshCount] = useState(0);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadOrders = () => {
    setLoading(true);
    setLoadError("");
    setActionError("");

    return observeOrders({
      onData: (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
      },
      onError: (error) => {
        console.error("[AdminDashboardPage] Order read failed", error);
        setLoadError(describeFirebaseOrderError(error, "read"));
        setLoading(false);
      },
    });
  };

  const handleMarkDelivered = async (orderId: string) => {
    try {
      setActionError("");
      await updateOrderStatus(orderId, "delivered");
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: "delivered" } : order,
        ),
      );
    } catch (error) {
      console.error("[AdminDashboardPage] Order status update failed", error);
      setActionError(describeFirebaseOrderError(error, "write"));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setActionError("");
      await deleteOrder(orderId);
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("[AdminDashboardPage] Order delete failed", error);
      setActionError(describeFirebaseOrderError(error, "write"));
    }
  };

  useEffect(() => {
    const unsubscribe = observeAdminAuth((user) => {
      if (!user) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        router.replace("/admin-login");
        return;
      }

      if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
        setIsAuthenticated(false);
        void signOutAdmin().finally(() => {
          setIsCheckingAuth(false);
          router.replace("/admin-login?error=denied");
        });
        return;
      }

      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const unsubscribeOrders = loadOrders();
    return unsubscribeOrders;
  }, [isAuthenticated, ordersRefreshCount]);

  const handleLogout = async () => {
    await signOutAdmin();
    router.replace("/admin-login");
  };

  if (isCheckingAuth) {
    return (
      <main className="min-h-[100dvh] w-full bg-[#F6F0E8] px-4 py-10 text-black sm:px-6">
        <div className="w-full rounded-3xl border border-black/10 bg-white p-6 text-center shadow-[0_14px_35px_rgba(0,0,0,0.07)] sm:p-8">
          Checking admin session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] w-full bg-[#F6F0E8] px-4 py-4 text-black sm:px-6 lg:px-8">
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
              Hidden Admin Panel
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Customer Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOrdersRefreshCount((value) => value + 1)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-black/5"
            >
              Logout
            </button>
          </div>
        </div>

        {actionError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className="w-full overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_14px_35px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full text-left text-sm">
              <thead className="bg-black/[0.03] text-black/70">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer Name</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Selected Product</th>
                  <th className="px-4 py-3 font-semibold">Payment Method</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Total Price</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-center text-black/55">
                      Loading orders...
                    </td>
                  </tr>
                )}

                {!loading && loadError && (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-center text-red-600">
                      {loadError}
                    </td>
                  </tr>
                )}

                {!loading && !loadError && orders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-center text-black/55">
                      No orders found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !loadError &&
                  orders.map((order) => (
                    <tr key={order.id} className="border-t border-black/5 align-top">
                      <td className="px-4 py-3 font-medium text-black">{order.fullName}</td>
                      <td className="px-4 py-3 text-black/80">{order.city}</td>
                      <td className="px-4 py-3 text-black/80">{order.address}</td>
                      <td className="px-4 py-3 text-black/80">{order.phone}</td>
                      <td className="px-4 py-3 text-black/80">
                        {order.products.map((product, index) => (
                          <p key={`${product.name}-${index}`}>
                            {product.name} x{product.quantity}
                          </p>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-black/80">
                        {order.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                      </td>
                      <td className="px-4 py-3 text-black/80">
                        <span className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                          {order.status === "delivered" ? "Delivered" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-black">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3 text-black/70">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleMarkDelivered(order.id)}
                            disabled={order.status === "delivered"}
                            className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {order.status === "delivered" ? "Delivered" : "Mark Delivered"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-black/5"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}