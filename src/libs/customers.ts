const execAddCustomer = async (
  email: string,
  name: string
): Promise<string | string[]> => {
  const data = { email: email, name: name };
  const response = await fetch("http://localhost:5000/api/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result.message;
};

const execEditCustomer = async (
  customerID: number,
  name: string
): Promise<string | string[]> => {
  const customerData = { name: name };
  const response = await fetch(
    "http://localhost:5000/api/customer/" + customerID,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    }
  );
  const result = await response.json();
  return result.message;
};

const execDeleteCustomer = async (
  customerID: number
): Promise<string | string[]> => {
  const response = await fetch(
    "http://localhost:5000/api/customer/" + customerID,
    {
      method: "DELETE",
    }
  );
  const result = await response.json();
  return result.message;
};

export { execAddCustomer, execEditCustomer, execDeleteCustomer };
