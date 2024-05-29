import { join } from 'path';

export default () => ({
  rootPath: process.cwd(),
  uploadsPath: join(process.cwd(), 'uploads'),
});
