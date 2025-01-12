export enum DreamCategory {
  MoneyDonation = "Money donation",
  VolunteerServices = "Volunteer services",
  Gifts = "Gifts",
}

export enum DreamStatus {
  New = "New",
  Pending = "Pending",
  Completed = "Completed",
}

export type Dream = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string;
  };
  name: string;
  description: string;
  image: string;
  image_url: string;
  cost: number;
  accumulated: number;
  status: DreamStatus;
  category: "Money donation" | "Volunteer services" | "Gifts";
  location: string;
  date_added: string;
  views: number;
  contributions: number;
};

