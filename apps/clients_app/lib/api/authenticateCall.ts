export default async function AuthenticateCall(
  email: string,
  password: string,
) {
  try {
    console.log(process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_URL);
    const response = await fetch(
      `${process.env.CORE_MICROSERVICE_URL}/authenticate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "something went wrong with auth");
    }
    return data;
  } catch (error) {
    throw new Error(
      "Something went wrong with authenticate call" + error.message,
    );
  }
}
