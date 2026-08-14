declare module "react-native-phone-call" {
  export type PhoneCallArgs = {
    number: string;
    prompt?: boolean;
  };

  export function call(args: PhoneCallArgs): Promise<void>;
}