import { deleteAsync } from 'del';
import config from '../config.js';

function clean() {
  return deleteAsync(config.dest.root)
};

export default clean;
