export enum DreamCategory {
  All = "All",
  Money_donation = "Money_donation",
  Volunteer_services = "Volunteer_services",
  Gifts = "Gifts",
}

export enum DreamStatus {
  New = "New",
  Pending = "Pending",
  Completed = "Completed",
}

export type Contribution = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string;
  };
  description?: string;
  date: string;
};

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
  image: File | string;
  image_url: string;
  cost: number;
  accumulated: number;
  status: DreamStatus;
  category: DreamCategory | string;
  location: string;
  date_added: string;
  views: number;
  contributions: Contribution;
};

