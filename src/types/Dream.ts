export enum DreamCategory {
  MoneyDonation = "Money donation",
  VolunteerServices = "Volunteer services",
  Gifts = "Gifts",
}

export type Dream = {
  id: number;
  user: number;
  name: string;
  description: string;
  image: string;
  image_url: string;
  cost: number;
  accumulated: number;
  status: DreamCategory;
  category: "Money donation" | "Volunteer services" | "Gifts";
  location: string;
  date_added: string;
  views: number;
  contributions: number;
};
