declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      JIRA_HOST: string;
      JIRA_USERNAME: string;
      JIRA_API_TOKEN: string;
    }
  }
}

export {}
