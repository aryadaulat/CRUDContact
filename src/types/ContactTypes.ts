export type Contact = {
  age: string;
  firstName: string;
  id: string;
  lastName: string;
  photo: string;
};

export type Contacts = {
  status: boolean;
  data: Contact[];
  isRefresh: boolean;
};
