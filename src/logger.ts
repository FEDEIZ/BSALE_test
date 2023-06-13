import { Logger } from 'tslog';

const logger = (name?: string): Logger => new Logger({
  name: name || 'default',
  displayFunctionName: false,
  displayFilePath: 'hidden',
});

export { logger };
