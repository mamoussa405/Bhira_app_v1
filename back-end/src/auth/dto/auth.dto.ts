import { IsNumber, IsPhoneNumber, IsString, IsStrongPassword} from "class-validator";



export class AuthDto {
	
	@IsPhoneNumber("MO")
	phone: string;

	@IsStrongPassword()
	password: string;
}