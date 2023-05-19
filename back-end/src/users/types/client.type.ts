/**
 * This interface is used to define the structure of the client object
 * that we will return when the use requests the list of clients.
 */
export interface IClient {
  id: number;
  name: string;
  phoneNumber: string;
  avatarURL: string;
}

export interface IConfirmCancelClient {
  message: string;
  id: number;
}
