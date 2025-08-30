// Helper funkcije za Profile komponentu
export const formatFirebaseDate = (timestamp: any) => {
  if (!timestamp) return "N/A";

  // Ako je Firebase Timestamp objekat
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString("sr-RS", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Ako je obični Date string
  return new Date(timestamp).toLocaleDateString("sr-RS", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const translateStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: "U pripremi",
    confirmed: "Potvrđeno",
    shipped: "Poslato",
    delivered: "Isporučeno",
    cancelled: "Otkazano",
  };

  return statusMap[status] || status;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
    case "Isporučeno":
      return "bg-green-100 text-green-800";
    case "shipped":
    case "Poslato":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
    case "Potvrđeno":
      return "bg-yellow-100 text-yellow-800";
    case "pending":
    case "U pripremi":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
    case "Otkazano":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
