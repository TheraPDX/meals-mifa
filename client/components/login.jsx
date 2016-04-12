Login = React.createClass({
    checkEmailIsValid (aString) {
        aString = aString || '';
        return aString.length > 1 && aString.indexOf('@') > -1;
    },
    checkPasswordIsValid(aString) {
        aString = aString || '';
        return aString.length > 7;
    },
    handleSubmit(event) {
        event.preventDefault();
        let emailAddress = $('[name="emailAddress"]').val(),
              password = $('[name="password"]').val();
        //trim
        emailAddress = emailAddress.replace(/^\s*|\s*$/g, '');
        password = password.replace(/^\s*|\s*$/g, '');

        //validate
        let isValidEmail = this.checkEmailIsValid(emailAddress);
        let isValidPassword = this.checkPasswordIsValid(password);

        if (!isValidEmail || !isValidPassword) {
            if (!isValidEmail) {
                Bert.alert('Invalid email address', 'warning');
            }
            if (!isValidPassword) {
                Bert.alert('Your password must be at least 8 characters long', 'warning');
            }
        } else {
            Meteor.loginWithPassword(emailAddress, password, function (error, result) {
                if (error) {
                    Bert.alert('There was an issue with your credentials. Please try again or reset your password.', 'warning');
                } else {
                    //subscribe to the routes feed (dep on email address)
                    Meteor.subscribe('routes');
                    //pass to routes page via router
                    FlowRouter.go('/routes');
                }
            });
        }
    },
    render() {
        return (
        <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-4'>
                <h4 className='page-header'>Login</h4>
                <form id='login' className='login' onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <input type='email' name='emailAddress' className='form-control' placeholder='Email Address' />
                    </div>
                    <div className='form-group'>
                        <input type='password' name='password' className='form-control' placeholder='Password' />
                    </div>
                    <div className='form-group'>
                        <input type='submit' className='btn btn-success' value='Login' />
                    </div>
                    <div className='form-group'>
                        <a className='pull-right' href='/recover-password'>
                            Forgot Password?
                        </a>
                    </div>
                </form>

                <div className='form-group'>
                    <p className='pull-left'>Need an account? <a href='/signup'>Sign Up</a>.</p>
                </div>        
            </div>
        </div>
        );
    }
});