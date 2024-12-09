export type Filter = {
  name: string;
  value: string;
};

export type Collaborator = {
  _id: string;
  user: {
    _id: string;
    userName: string;
    email: string;
    image: string;
  };
  status: string;
};

// Type when creating Cabin
export interface User {
  _id: string;
  userName: string;
  email: string;
  accountType: string;
  image: string;
}

export interface Event {
  _id: string;
  name: string;
  type: string;
  status: string;
  emailSent: boolean;
  startDate: string;
  endDate: string;
  participantCount: number;
  prizeCount: number;
  remainingPrize: number;
}

export interface EventForm {
  name?: string;
  type?: string;
  status?: string;
  startDate?: string;
}

export interface Participant {
  _id: string;
  name: string;
  email: string;
  ticketNumber: string;
  isWinner: boolean;
  prize: { name: string; image: string };
}

export interface ParticipantForm {
  name?: string | undefined;
  email?: string | undefined;
  ticketNumber?: number;
  eventId?: string;
  isWinner?: boolean;
  prizeId?: string;
}

export interface PrizeForm {
  name?: string;
  image?: string;
  quantity?: number;
  eventId?: string;
}

export interface Prize {
  _id: string;
  name: string;
  image: string;
  quantity: number;
}

export interface BookingParams {
  page: string;
  status: string;
  sortBy: string;
}

export interface Settings {
  breakFastPrice: number;
}

export type BookingRowProps = {
  event?: Event;
  participant?: Participant;
};

export interface SettingsRandora {
  theme: ThemeColor;
  textLogo?: string;
  coverLogo?: string;
  brandName?: string;
  spinnerStyle: "classic" | "modern" | "minimal";
  confettiEnabled: boolean;
  soundEnabled: boolean;
}

export interface ThemeColor {
  primary: string;
  secondary: string;
}
