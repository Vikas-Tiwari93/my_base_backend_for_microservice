export type SininTypeRequest = {
  userName: String;
  password: String;
  isAdmin: Boolean;
};

export type SignupTypeAdminRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  organisationName: string;
  organisationId: string;
  isAgreement: boolean;
};
export type SignupTypeAdminQuery = {
  organisationId: string;
  name: string;
  userName: string;
  password: string;
  organisationName: string;
  isAgreement: boolean;
  isActive: boolean;
  authToken: string;
};
export type SignupTypeAdminSchema = Document &
  SignupTypeAdminQuery & {
    createdAt: Date;
    updatedAt: Date;
  };
export type SignupTypeStudentRequest = {
  firstName: string;
  lastName: string;
  userName: string;
  organisationName: string;
  organisationId: string;
  isAgreement: boolean;
  createdAt: Date;
  updatedAt: Date;
};
