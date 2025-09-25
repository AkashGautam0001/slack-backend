import User from '../schema/user';
import crudRepository from './crudRepository';

const userRepository = {
  ...crudRepository(User),
  getByEmail: async function (email) {
    const user = await User.findOne({ email: email });
    return user;
  },
  getByUsername: async function (username) {
    const user = await User.findOne({ username: username });
    return user;
  }
};

export default userRepository;
