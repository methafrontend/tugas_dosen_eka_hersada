import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

function emailPatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value) ? null : { invalidEmailPattern: true };
    };
}

function linkPatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;

        const regex =
            /^https:\/\/([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?(\?.*)?$/;
        return regex.test(value) ? null : { invalidLinkPattern: true };
    };
}

export { emailPatternValidator, linkPatternValidator };

