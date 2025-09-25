import User from '../schema/user';
import crudRepository from './crudRepository';

function userRepository() {
  crudRepository.call(this, User);
}

export default new userRepository();
