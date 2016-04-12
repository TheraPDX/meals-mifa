Signup = React.createClass({
    checkEmailIsValid (aString) {
        aString = aString || '';
        return aString.length > 1 && aString.indexOf('@') > -1;
    },
    checkPasswordIsValid(aString) {
        aString = aString || '';
        return aString.length > 7;
    },
    checkPhoneIsValid(aString){
      var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (phoneRegex.test(aString)) {
        return true;
      } else {
        return false;          // Invalid phone number
      }
    },

    handleSubmit( event ) {
      event.preventDefault();
      let emailAddress = $('[name="emailAddress"]').val(),
            password = $('[name="password"]').val(),
            passwordConfirm =$('[name="passwordConfirm"]').val(),
            firstName =$('[name="firstName"]').val(),
            lastName =$('[name="lastName"]').val(),
            phoneNumber =$('[name="phoneNumber"]').val();


      //trim
      emailAddress = emailAddress.replace(/^\s*|\s*$/g, '');
      password = password.replace(/^\s*|\s*$/g, '');

      //check complex validation
      let isValidEmail = this.checkEmailIsValid(emailAddress);
      let isValidPassword = this.checkPasswordIsValid(password);
      let isValidPhone = this.checkPhoneIsValid(phoneNumber);


      //trim
      emailAddress = emailAddress.replace(/^\s*|\s*$/g, '');
      password = password.replace(/^\s*|\s*$/g, '');
      passwordConfirm = passwordConfirm.replace(/^\s*|\s*$/g, '');


      // simple validation & messaging
      if (!isValidEmail) {
          Bert.alert('Invalid email address.', 'warning');
          return;
      }
      if (!isValidPassword) {
          Bert.alert('Your password must be at least 8 characters long.', 'warning');
          return;
      }
      if(passwordConfirm != password){
          Bert.alert('Your passwords do not match.', 'warning')
          return;
      }
      if(!isValidPhone){
          Bert.alert('Please enter a valid phone number.', 'warning')
          return;
      }
      if(lastName==''){
        Bert.alert('Please enter your last name.', 'warning');
        return;
      }
      if(firstName==''){
        Bert.alert('Please enter your first name.', 'warning');
        return;
      }

      Meteor.call('createAccount', emailAddress, firstName, lastName, phoneNumber, Accounts._hashPassword(password));
      FlowRouter.go('/validation-landing');
    },
    
    render() {
        return (
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-4">
              <h4 className="page-header">Sign Up</h4>
              <form id="signup" className="signup" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input type="email" name="emailAddress" className="form-control" placeholder="Email Address" />
                </div>
                <div className="form-group">
                  <input type="text" name="firstName" className="form-control" placeholder="First Name" />
                </div>
                <div className="form-group">
                  <input type="text" name="lastName" className="form-control" placeholder="Last Name" />
                </div>
                <div className="form-group">
                  <input type="text" name="phoneNumber" className="form-control" placeholder="(XXX)XXX-XXXX" />
                </div>
                <div className="form-group">
                  <input type="password" name="password" className="form-control" placeholder="Password" />
                </div>
                <div className="form-group">
                  <input type="password" name="passwordConfirm" className="form-control" placeholder="Password" />
                </div>
                <div className="form-group">
                  <input type="submit" className="btn btn-success" value="Sign Up" />
                </div>
              </form>
              <p>Already have an account? <a href="/login">Log In</a>.</p>
            </div>
          </div>
      );
    }
});