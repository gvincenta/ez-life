var mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//id : google id, email: gmail account.
//do we have to specify "required"? 
var personSchema = mongoose.Schema(
    {
       
        email: {
            type : String,
            lowercase : true,
            required: true
        },
        password : {
            type : String,
            required : true
        },
        name : String, 
        birthdate : Date,
        gender : 
            {
                type : String,
                enum: ["male", "female", "other"],
                lowercase : true
            }
    }
);

personSchema.pre('save', async function(next) {
    try{
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Generate a password hash (salt + hash)
      const passwordHash = await bcrypt.hash(this.password, salt);
      // Re-assign hashed version over original, plain text password
      this.password = passwordHash;
      next();
    } catch(error) {
      next(error);
    }
  });
  
personSchema.methods.isValidPassword = async function(newPassword) {
    try {
      return await bcrypt.compare(newPassword, this.password);
    } catch(error) {

      throw new Error(error);
    }
}

//export
mongoose.model('person',personSchema);
