type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  successMessage?: string;
  errorMessage?: string;
  navigateTo?: string; // optional, für automatische Weiterleitung bei Erfolg
};

export async function fetchWithToast(
  url: string,
  options: Options = {},
): Promise<any> {
  const {
    method = "GET",
    body,
    successMessage,
    errorMessage,
    navigateTo,
  } = options;

  try {
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      (window as any).toast(`❌ ${data.error || errorMessage || "Fehler"}`);
      return null;
    }

    if (successMessage) {
      (window as any).toast(`✅ ${successMessage}`);
    }

    if (navigateTo) {
      setTimeout(() => (window.location.href = navigateTo), 500);
    }

    return await res.json().catch(() => ({}));
  } catch (err) {
    console.error("fetchWithToast:", err);
    (window as any).toast("❌ Netzwerkfehler");
    return null;
  }
}
