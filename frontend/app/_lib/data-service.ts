"use server";
// import { notFound } from "next/navigation";
// import { eachDayOfInterval } from "date-fns";

import { revalidatePath } from "next/cache";
import { Setting } from "../_components/UpdateSettingsForm";
import { RESULTS_PER_PAGE } from "../_utils/constants";
// import { notFound } from "next/navigation";
// import { EventForm, ParticipantForm } from "../_utils/types";
import AppError from "../_utils/AppError";
import { getToken } from "../_utils/serverUtils";
import { EventForm, ParticipantForm, PrizeForm } from "../_utils/types";

const URL = "https://mega-draw.vercel.app/api/v1";
// const DEV_URL = "http://localhost:5000/api/v1";

// /////////////
// // AUTH

export async function getSettings() {
  try {
    const res = await fetch(`${URL}/settings`);

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Settings couldnt load");

    const {
      data: { settings },
    } = data;
    return settings;
  } catch (err) {
    throw err;
  }
}

export async function updateSetting(data: Partial<Setting>, token: string) {
  if (!token) return;
  try {
    const res = await fetch(`${URL}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Send the serialized data
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Failed to update settings");

    const {
      data: { settings },
    } = result;

    revalidatePath("/dashboard/settings");
    return settings;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
    return { status: "error", message: "An unknown error occured" };
  }
}
export async function login(formData: FormData) {
  // Safely extract email and password
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  // Validate that email and password are not null
  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  console.log(email, password);

  try {
    const res = await fetch(`${URL}/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    // Check if the response was successful
    if (!res.ok) throw new Error(data.message || "Login failed");

    return data;

    // Destructure token and user from response
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function signUp(formData: FormData, token: string) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("fullName");
  const confirmPassword = formData.get("confirmPassword");
  const isRoot = formData.get("isRoot") === "on" ? true : false;

  let res;
  try {
    // const token = getToken
    res = await fetch(`${URL}/admins/signUp`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        name,
        confirmPassword,
        isRoot,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // Check if the response was successful
    if (!res.ok) throw new Error(data.message || "Signup failed");

    // Destructure token and user from response
    const {
      data: { user },
    } = data;

    return { token, user };
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", statusCode: res?.status, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function forgotPassword(email: string) {
  try {
    const res = await fetch(`${URL}/users/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function resetPassword({
  password,
  confirmPassword,
  token,
}: {
  password: string;
  confirmPassword: string;
  token: string;
}) {
  try {
    const res = await fetch(`${URL}/users/reset-password?token=${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, confirmPassword }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
  }
}

export async function authorize(token: string) {
  try {
    if (!token) return false;

    const res = await fetch(`${URL}/verifyToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("");
    return true;
  } catch {
    return false;
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    const res = await fetch(`${URL}/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    }
  }
}

export async function resendOtp(email: string) {
  try {
    const res = await fetch(`${URL}/users/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err: unknown) {
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getUser() {
  const token = await getToken();
  let statusCode;
  try {
    const res = await fetch(`${URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    statusCode = res.status;
    if (!res.ok) throw new Error(data.message);

    const {
      data: { user },
    } = data;
    return user;
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function updateUser(formData: {
  email: FormDataEntryValue;
  userName: FormDataEntryValue;
  image?: string | undefined;
}) {
  let statusCode;

  const token = await getToken();
  try {
    const res = await fetch(`${URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    statusCode = res.status;
    // Check if the response was successful
    if (!res.ok) throw new Error(data.message || "Signup failed");

    // Destructure token and user from response
    const {
      data: { user },
    } = data;

    revalidatePath("/dashboard/account");
    return user;
  } catch (err: unknown) {
    console.log(err);
    // Improved error handling
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function updatePassword(
  formFields: {
    currPassword: FormDataEntryValue;
    password: FormDataEntryValue;
    confirmPassword: FormDataEntryValue;
  },
  token: string
) {
  let statusCode;
  try {
    const res = await fetch(`${URL}/admins/updateMyPassword`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formFields),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update password");

    const {
      data: { admin },
      token: adminToken,
    } = data;

    return { admin, token: adminToken };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", statusCode, message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getMyEvents(searchParams: {
  page: string | null;
  status: string | null;
  sortBy: string | null;
}) {
  console.log("in here");
  const token = await getToken();
  if (!token) return;

  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}&sort=-createdAt`;

  console.log(query);
  // Filter
  if (status && status !== "all") query += `&status=${status}`;

  // Sort, highest participant,
  switch (sort) {
    case "startDate-desc":
      query += "&sort=-startDate";
      break;
    case "startDate-asc":
      query += "&sort=startDate";
      break;
    case "participants-desc":
      query += "&sort=-participantCount";
      break;
    case "participants-asc":
      query += "&sort=participantCount";
      break;
    default:
      query += "&sort=-createdAt";
  }

  console.log(query);

  const res = await fetch(`${URL}/users/me/events${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  console.log(data);

  const {
    totalCount,
    results,
    data: { events },
  } = data;

  return { events, totalCount, results };
}

export async function createEvent(eventData: EventForm) {
  const token = await getToken();

  if (!token) return;

  const res = await fetch(`${URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { event },
  } = data;

  return event;
}

export async function updateEvent({
  eventId,
  eventData,
}: {
  eventId: string;
  eventData: EventForm;
}) {
  const token = await getToken();
  if (!token) return;

  const res = await fetch(`${URL}/events/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
}

export async function deleteEvent(eventId: string) {
  try {
    const token = await getToken();
    if (!token) return;

    console.log(eventId);

    console.log(token);

    const res = await fetch(`${URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    const data = await res.json();
    if (!res.ok) {
      throw new AppError(data.message, res.status);
    }

    return { status: "success" };
  } catch (err: unknown) {
    throw err;
  }
}

export async function getEventParticipants(
  eventId: string,
  searchParams: {
    page: string | null;
    status: string | null;
    sortBy: string | null;
  }
) {
  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}`;

  // Filter
  if (status && status === "winners") query += `&isWinner=true`;

  // Sort, highest participant,
  switch (sort) {
    case "createdDate-desc":
      query += "&sort=-createdAt";
      break;
    case "createdDate-asc":
      query += "&sort=createdAt";
      break;
    case "ticketNumber-desc":
      query += "&sort=-ticketNumber";
      break;
    case "ticketNumber-asc":
      query += "&sort=ticketNumber";
      break;
  }

  const token = await getToken();

  try {
    const res = await fetch(`${URL}/events/${eventId}/participants${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { participants },
    } = data;

    return { participants, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function createParticipant(participantForm: ParticipantForm) {
  const token = await getToken();

  if (!token) return;

  console.log(participantForm);
  const res = await fetch(`${URL}/participants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(participantForm),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    totalCount,
    results,
    data: { participants },
  } = data;

  return { participants, totalCount, results };
}

export async function uploadParticipants(formData: FormData) {
  const res = await fetch(`${URL}/participants/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { participants },
  } = data;

  return participants;
}

export async function updateParticipant({
  participantId,
  participantForm,
}: {
  participantId: string;
  participantForm: ParticipantForm;
}) {
  const token = await getToken();
  if (!token) return;

  const res = await fetch(`${URL}/participants/${participantId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(participantForm),
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return { status: "success" };
}

export async function deleteParticipant(participantId: string) {
  try {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${URL}/participants/${participantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    return { status: "success" };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function getEventPrizes(
  eventId: string,
  searchParams: {
    page: string | null;
    status: string | null;
    sortBy: string | null;
  }
) {
  const token = await getToken();
  if (!token) return;

  let query = "";

  const page = searchParams.page || 1;
  const status = searchParams.status;
  const sort = searchParams.sortBy;

  // Page
  query += `?page=${page}&limit=${RESULTS_PER_PAGE}`;

  // Filter

  if (status && status !== "all") query += `&status=${status}`;

  // Sort, highest participant,
  switch (sort) {
    case "createdDate-desc":
      query += "&sort=-createdAt";
      break;
    case "createdDate-asc":
      query += "&sort=createdAt";
      break;
    case "quantity-desc":
      query += "&sort=-quantity";
      break;
    case "quantity-asc":
      query += "&sort=quantity";
      break;
  }

  console.log(query);

  try {
    const res = await fetch(`${URL}/events/${eventId}/prizes${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const {
      totalCount,
      results,
      data: { prizes },
    } = data;

    return { prizes, totalCount, results };
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

export async function createPrize(prizeForm: PrizeForm) {
  const token = await getToken();

  if (!token) return;

  const res = await fetch(`${URL}/prizes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prizeForm),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  const {
    data: { prize },
  } = data;

  return prize;
}

export async function updatePrize({
  prizeId,
  prizeForm,
}: {
  prizeId: string;
  prizeForm: PrizeForm;
}) {
  const token = await getToken();
  if (!token) return;

  const res = await fetch(`${URL}/prizes/${prizeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prizeForm),
  });

  // Check if the response was successful
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  const {
    data: { prize },
  } = data;

  return prize;
}

export async function deletePrize(prizeId: string) {
  try {
    const token = await getToken();
    if (!token) return;

    console.log(token);

    const res = await fetch(`${URL}/prizes/${prizeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response was successful
    const data = await res.json();
    if (!res.ok) {
      throw new AppError(data.message, res.status);
    }

    return { status: "success" };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { status: "error", message: err.message };
    } else {
      return { status: "error", message: "An unknown error occurred" };
    }
  }
}

// export async function getAllCabins(searchParams?: {
//   page: string;
//   discount: string;
//   sortBy: string;
// }) {
//   let statusCode;
//   let query = "";

//   if (searchParams) {
//     const page = searchParams.page || 1;
//     const discount = searchParams.discount;
//     const sort = searchParams.sortBy || "startDate-desc";

//     // Page
//     query += `?page=${page}&limit=${RESULTS_PER_PAGE}`;

//     // Filter
//     switch (discount) {
//       case "no-discount":
//         console.log("no discount");
//         query += "&discount=0";
//         break;

//       case "with-discount":
//         query += "&discount[gt]=0";
//     }

//     // Sort
//     switch (sort) {
//       case "name-asc":
//         query += "&sort=name";
//         break;
//       case "name-desc":
//         query += "&sort=-name";
//         break;
//       case "regularPrice-asc":
//         query += "&sort=regularPrice";
//         break;
//       case "regularPrice-desc":
//         query += "&sort=-regularPrice";

//       case "maxCapacity-asc":
//         query += "&sort=maxCapacity";

//       case "maxCapacity-desc":
//         query += "&sort=-maxCapacity";
//     }
//   }

//   try {
//     const res = await fetch(`${URL}/cabins/${query}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       next: { revalidate: 60 },
//     });

//     const data = await res.json();

//     statusCode = res.status;

//     if (!res.ok) {
//       throw new Error(data.message);
//     }

//     console.log(data);
//     const {
//       totalCount,
//       results,
//       data: { cabins },
//     } = data;

//     return { cabins, totalCount, results };
//   } catch (err) {
//     if (err instanceof Error) {
//       return { status: "error", statusCode, message: err.message };
//     } else {
//       return { status: "error", message: "An unknown error occurred" };
//     }
//   }
// }

// export async function getCabin(id: string) {
//   console.log("getting cabin");
//   try {
//     const res = await fetch(
//       `${URL}/cabins/${id}`,

//       {
//         next: {
//           revalidate: 60,
//         },
//       }
//     );

//     const data = await res.json();
//     // data.error || data.data

//     if (!res.ok) {
//       throw new Error(data.error);
//     }

//     const {
//       data: { cabin },
//     } = data;

//     console.log(cabin);

//     return cabin;
//   } catch {
//     notFound();
//   }
// }

// export async function createCabin(token: string, cabinData: CabinData) {
//   console.log("creating cabins 2");

//   let res;
//   try {
//     // const token = getToken
//     res = await fetch(`${URL}/cabins`, {
//       method: "POST",
//       body: JSON.stringify(cabinData),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();

//     // Check if the response was successful
//     if (!res.ok) throw new Error(data.message);

//     // Destructure token and user from response
//     const {
//       data: { cabin },
//     } = data;

//     revalidatePath("/dashboard/cabins");
//     return cabin;
//   } catch (err: unknown) {
//     console.log(err);
//     // Improved error handling
//     if (err instanceof Error) {
//       return { status: "error", statusCode: res?.status, message: err.message };
//     } else {
//       return { status: "error", message: "An unknown error occurred" };
//     }
//   }
// }

// export async function updateCabin(
//   token: string,
//   id: string | undefined,
//   cabinData: CabinData
// ) {
//   console.log("editing cabins 2");

//   let res;
//   try {
//     // const token = getToken
//     res = await fetch(`${URL}/cabins/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(cabinData),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();

//     // Check if the response was successful
//     if (!res.ok) throw new Error(data.message);

//     // Destructure token and user from response
//     const {
//       data: { cabin },
//     } = data;

//     revalidatePath("/dashboard/cabins");
//     return cabin;
//   } catch (err: unknown) {
//     console.log(err);
//     // Improved error handling
//     if (err instanceof Error) {
//       return { status: "error", statusCode: res?.status, message: err.message };
//     } else {
//       return { status: "error", message: "An unknown error occurred" };
//     }
//   }
// }

// export async function deleteCabin(id: string, token: string) {
//   if (!token) return;

//   let res;
//   try {
//     // const token = getToken
//     res = await fetch(`${URL}/cabins/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // Check if the response was successful
//     if (!res.ok) {
//       const data = await res.json();
//       throw new Error(data.message);
//     }

//     // Destructure token and user from response

//     revalidatePath("/dashboard/cabins");
//     return { status: "success" };
//   } catch (err: unknown) {
//     console.log(err);
//     // Improved error handling
//     if (err instanceof Error) {
//       return { status: "error", statusCode: res?.status, message: err.message };
//     } else {
//       return { status: "error", message: "An unknown error occurred" };
//     }
//   }
// }

export async function getBooking(id: string, token: string | null) {
  if (!token) return;

  try {
    const res = await fetch(
      `${URL}/bookings/${id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure the 'Authorization' key is capitalized
        },
      }
    );

    const data = await res.json();
    // data.error || data.data

    if (!res.ok) {
      throw new Error(data.message);
    }

    const {
      data: { booking },
    } = data;

    console.log(booking);
    return booking;
  } catch (err) {
    throw err;
  }
}

export async function getBookingAfterDate(
  token: string | null,
  lastDays: number
) {
  if (!token) return;
  try {
    const res = await fetch(
      `${URL}/bookings/getBookingsAfter?date=${lastDays}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure the 'Authorization' key is capitalized
        },
      }
    );

    const data = await res.json();
    // data.error || data.data

    if (!res.ok) {
      throw new AppError(data.message, res.status);
    }

    const {
      data: { bookings },
    } = data;

    return bookings;
  } catch (err: unknown) {
    throw err;
  }
}

// export async function updateBooking({
//   token,
//   bookingId,
//   obj,
// }: {
//   token: string | null;
//   bookingId: string;
//   obj: BookingData;
// }) {
//   if (!token) return;

//   try {
//     // const token = getToken
//     const res = await fetch(`${URL}/bookings/${bookingId}`, {
//       method: "PATCH",
//       body: JSON.stringify(obj),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();

//     // Check if the response was successful
//     if (!res.ok) throw new AppError(data.message, res.status);

//     // Destructure token and user from response
//     const {
//       data: { booking },
//     } = data;

//     return booking;
//   } catch (err: unknown) {
//     throw err;
//   }
// }

// export async function login(email, password) {
//   const res = await fetch(`${URL}/guests/login`, {
//     method: "POST",
//     body: JSON.stringify({
//       email,
//       password,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const data = await res.json();

//   if (!res.ok) throw new Error(data.message);

//   const {
//     token,
//     data: { user },
//   } = data;

//   return { user, token };
// }

// export async function getGuest(email) {
//   const res = await fetch(`${URL}/guests/email/?email=${email}`, {
//     headers: {
//       "Content-Type": "application/json", // Set the content type to JSON
//     },
//   });

//   const data = await res.json();

//   if (!res.ok) throw new Error(data.message);

//   const {
//     data: { guest },
//   } = data;

//   return guest;
// }
// export async function createGuest(user) {
//   console.log(user);
//   const res = await fetch(`${URL}/guests/signup`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json", // Set the content type to JSON
//     },
//     body: JSON.stringify(user),
//   });

//   const data = await res.json();

//   if (!res.ok) throw new Error(data.message);

//   const {
//     data: { guest },
//   } = data;
//   return guest;
// }

// export async function updateGuest(formData) {
//   const token = await getToken();

//   const res = await fetch(`${URL}/guests/updateMe`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(formData),
//   });

//   const data = await res.json();

//   console.log(data);

//   if (!res.ok) throw Error(data.message);
//   const {
//     data: { guest },
//   } = data;
//   return guest;
// }

// export async function signIn(email) {
//   try {
//     const res = await fetch(`${URL}/guests/signIn`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", // Set the content type to JSON
//       },

//       body: JSON.stringify({
//         email,
//       }),
//     });

//     const data = await res.json();
//     console.log(data);

//     if (!res.ok) throw new Error(data.message);

//     const {
//       data: { user },
//       token,
//     } = data;
//     return { user, token };
//   } catch (err) {
//     console.log("An error occured");
//     console.error(err.message);
//   }
// }
// /////////////
// // GET

// export async function getCabinPrice(id) {
//   const { data, error } = await supabase
//     .from("cabins")
//     .select("regularPrice, discount")
//     .eq("id", id)
//     .single();

//   if (error) {
//     console.error(error);
//   }

//   return data;
// }

// export async function getCabin(id) {
//   try {
//     const res = await fetch(
//       `${URL}/cabins/${id}`,

//       {
//         next: {
//           revalidate: 60,
//         },
//       }
//     );

//     const data = await res.json();
//     // data.error || data.data

//     if (!res.ok) {
//       throw new Error(data.error);
//     }

//     const {
//       data: { cabin },
//     } = data;

//     return cabin;
//   } catch {
//     notFound();
//   }
// }

// export const getCabins = async function (filters) {
//   let query = "";
//   if (filters?.capacity) {
//     switch (filters.capacity) {
//       case "small":
//         query += "maxCapacity[lte]=3";
//         break;
//       case "medium":
//         query += "maxCapacity[gte]=4&maxCapacity[lte]=7";
//         break;
//       case "large":
//         query += "maxCapacity[gte]=8";
//         break;
//       default:
//         break;
//     }
//   }

//   try {
//     const res = await fetch(`${URL}/cabins?${query}`, {
//       next: {
//         revalidate: 60,
//       },
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message);
//     }

//     const {
//       data: { cabins },
//     } = data;

//     return cabins;
//   } catch (err) {
//     console.error(err);
//   }
// };

// // Guests are uniquely identified by their email address

// export async function getBooking(bookingId) {
//   const token = await getToken();
//   try {
//     const res = await fetch(`${URL}/bookings/${bookingId}`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // Set the content type to JSON
//       },
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.message);

//     const {
//       data: { booking },
//     } = data;

//     return booking;
//   } catch {
//     notFound();
//   }
// }

// export async function getBookedDatesByCabinId(cabinId) {
//   let today = new Date();
//   today.setUTCHours(0, 0, 0, 0);
//   today = today.toISOString();

//   const res = await fetch(
//     `https://the-eleganta-escape.vercel.app/api/v1/cabins/${cabinId}/bookings`,
//     {
//       next: {
//         revalidate: 60,
//       },
//     }
//   );

//   const data = await res.json();

//   if (!res.ok) throw new Error(data.error);

//   const {
//     data: { bookings },
//   } = data;

//   const bookedDates = bookings
//     .map((booking) => {
//       return eachDayOfInterval({
//         start: new Date(booking.startDate),
//         end: new Date(booking.endDate),
//       });
//     })
//     .flat();

//   console.log(bookedDates);

//   return bookedDates;
// }

// export async function getCountries() {
//   try {
//     const res = await fetch(
//       "https://restcountries.com/v2/all?fields=name,flag"
//     );
//     if (!res.ok) throw new Error("Could not fetch countries");
//     const countries = await res.json();

//     return countries;
//   } catch (err) {
//     console.log("error is", err);
//     throw new Error(err.message);
//   }
// }

// /////////////
// // CREATE

// export async function createBooking(formData) {
//   const token = await getToken();

//   const res = await fetch(`${URL}/bookings`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(formData),
//   });

//   const data = await res.json();

//   if (!res.ok) throw Error(data.message);

//   const {
//     data: { bookings },
//   } = data;
//   return bookings;
// }

// export async function updateBooking(formData, bookingId) {
//   const token = await getToken();
//   try {
//     const res = await fetch(`${URL}/bookings/${bookingId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     if (!res.ok) throw Error(data.message);

//     const {
//       data: { booking },
//     } = data;

//     console.log("updated booking", booking);
//     return booking;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// }

// /////////////
// // DELETE

// export async function deleteBooking(bookingId) {
//   const token = await getToken();
//   const res = await fetch(`${URL}/bookings/${bookingId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   // Check if the response status is 204 (No Content)
//   if (res.status !== 204) {
//     const data = await res.json();
//     throw new Error(data.message || "Booking could not be delete booking");
//   }
// }

// export async function updateSetting(formData: FormData) {
//   const data = Object.fromEntries(formData);

//   console.log(data);

//   try {
//     const res = await fetch(`${URL}/settings`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data), // Send the serialized data
//     });

//     const result = await res.json();

//     if (!res.ok) throw new Error(result.message || "Failed to update settings");

//     const {
//       data: { settings },
//     } = result;

//     console.log("updated booking", settings);
//     return settings;
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return { status: "error", message: err.message };
//     }
//     return { status: "error", message: "An unknown error occured" };
//   }
// }
