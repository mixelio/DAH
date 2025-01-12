const APY_KEY =
  "https://dah-production-f4c2.up.railway.app/api/user/token/refresh/";

export const refreshAccess = async (): Promise<string | null> => {
  try {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      return null;
    }
    const response = await fetch(APY_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refresh }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const {accessTocken} = data;
    if (!accessTocken) {
      return null;
    }
    
    localStorage.setItem("access", accessTocken);

    return accessTocken;
  } catch (error) {
    console.log(error);
    return null;
  }
};