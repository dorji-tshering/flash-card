export const emailValidate = (email: string, setError: Function) => {
    let isValid = true;
    const allowedEmails = ['dorji.contact@gmail.com'];

    if(email === '') {
        setError((error: {email: string, password: string}) => { 
            return {
                email: 'Email is required',
                password: error.password
            }
        });
        isValid = false;
    }else if(!email.includes('@')) { 
        setError((error: {email: string, password: string}) => { 
            return {
                email: 'Email must contain @ symbol',
                password: error.password
            }
        });
        isValid = false;
    } else if(email.includes('@')) {
        let input = document.createElement('input');

        input.type = 'email';
        input.required = true;
        input.value = email;

        let validity = typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(email);

        if(!validity) {
            setError((error: {email: string, password: string}) => { 
                return {
                    email: 'Email is invalid',
                    password: error.password
                }
            });
            isValid = false;
        } else {
            if(!allowedEmails.includes(email)) {
                setError((error: {email: string, password: string}) => { 
                    return {
                        email: 'Email is not allowed.',
                        password: error.password
                    }
                });
                isValid = false;
            } else {
                setError((error: {email: string, password: string}) => { 
                    return {
                        email: '',
                        password: error.password
                    }
                });
            }
        }
    } 

    return isValid;
}

export const passwordValidate = (password: string, setError: Function) => {
    let isValid = true;

    if(password === '') {
        setError((error: {email: string, password: string}) => { 
            return {
                email: error.email,
                password: 'Password is required.'
            }
        });
        isValid = false;
    } else if(password.length < 6) {
        setError((error: {email: string, password: string}) => { 
            return {
                email: error.email,
                password: 'Password must contain at least 6 characters.'
            }
        });
        isValid = false;
    }else {
        setError((error: {email: string, password: string}) => { 
            return {
                email: error.email,
                password: ''
            }
        });
    }

    return isValid;
}