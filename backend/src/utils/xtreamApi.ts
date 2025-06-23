import { decrypt } from '../utils/encryption'

export async function fetchAccountStatus(account: any) {
  const decryptedPassword = decrypt(account.password)
  const url = `http://${account.provider.domain}:${account.provider.port}/player_api.php?username=${account.user}&password=${decryptedPassword}`;

  try {
    console.log(url);
    const res = await fetch(url);
    const data = await res.json();
    const userInfo = data.user_info;

    return {
      status: userInfo.status,
      expirationDate: new Date(parseInt(userInfo.exp_date) * 1000),
      activeConnections: parseInt(userInfo.active_cons),
      maxConnections: parseInt(userInfo.max_connections)
    };
  } catch (error) {
    console.error("API error:", error);
    return {
      status: "Unknown",
      expirationDate: new Date(),
      activeConnections: 0,
      maxConnections: 0
    };
  }
}
