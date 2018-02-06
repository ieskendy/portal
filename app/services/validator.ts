import * as EmailValidator from 'email-validator';

export class Validator {

	public validateEmail(email: string) {
		if(EmailValidator.validate(email)) {
			return true;
		}
		return  false;
	}


	public len(input: any, min: number, max: number) {
		if (input != null) {
			if (input.length >= min && input.length <= max) {
				return true;
			}
			return false;
		}

		return false;
	}

	public isNumber(input) {
		if (!(input != null)) {
	    	return false;
	  	} else {
	    	return input.match(/^-?[0-9]+$/);
	 	}
	}
}