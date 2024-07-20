import axios from 'axios';
import base64 from 'base-64';
import { InternalError } from '@raypan2022-tickets/common';

interface Tokens {
  access_token: string;
  refresh_token: string;
  [key: string]: any; // Allow for additional properties
}

const client_id = process.env.CLIENT_ID!;
const client_secret = process.env.CLIENT_SECRET!;

// Encode client_id and client_secret in base64
const authString = base64.encode(`${client_id}:${client_secret}`);

// Prepare the Authorization header
const headers = {
  Authorization: `Basic ${authString}`,
  'Content-Type': 'application/x-www-form-urlencoded',
};

// Function to get an access token
const getAccessToken = async (code: string): Promise<Tokens> => {
  try {
    const response = await axios.post(
      'https://auth.calendly.com/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://ticketing.dev/auth/calendly/callback', // Replace with your actual redirect URI
      },
      { headers }
    );
    
    return response.data;
  } catch (error) {
    throw new InternalError(
      'Something went wrong while logging in to Calendly'
    );
  }
};

class TokenManager {
  private client_id: string;
  private client_secret: string;
  private authString: string;
  private headers: any;

  constructor(private access_token: string, private refresh_token: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.authString = base64.encode(`${client_id}:${client_secret}`);
    this.headers = {
      Authorization: `Basic ${this.authString}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  async refreshToken(): Promise<Tokens> {
    try {
      const response = await axios.post(
        'https://auth.calendly.com/oauth/token',
        {
          grant_type: 'refresh_token',
          refresh_token: this.refresh_token,
        },
        { headers: this.headers }
      );
      
      this.access_token = response.data.access_token;
      this.refresh_token = response.data.refresh_token;
      return response.data;
    } catch (error) {
      throw new InternalError('Something went wrong while refreshing the Calendly token');
    }
  }

  async requestWithRetry<T>(
    requestFn: (token: string) => Promise<T>
  ): Promise<T> {
    try {
      // Attempt the request with the current access token
      return await requestFn(this.access_token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        // If unauthorized, attempt to refresh the token
        try {
          const tokens = await this.refreshToken();
          // Retry the request with the new access token
          return await requestFn(tokens.access_token);
        } catch (error) {
          throw new InternalError(
            'Something went wrong while refreshing the token and retrying the request'
          );
        }
      } else {
        throw new InternalError(
          'Something went wrong while refreshing the token and retrying the request'
        );
      }
    }
  }
}

export default TokenManager;

// Example function using the TokenManager class to get user URI
const getUserURI = async (access_token: string, refresh_token: string): Promise<string> => {
  const tokenManager = new TokenManager(access_token, refresh_token);
  const requestFn = async (token: string) => {
    const response = await axios.get(
      'https://api.calendly.com/users/me',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data.resource.uri;
  };

  return tokenManager.requestWithRetry<string>(requestFn);
};

// Example function using the TokenManager class to get event types
const getEventTypes = async (user: string, access_token: string, refresh_token: string): Promise<any> => {
  const tokenManager = new TokenManager(access_token, refresh_token);
  const requestFn = async (token: string) => {
    const response = await axios.get(
      'https://api.calendly.com/event_types',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { user }
      }
    );
    return response.data;
  };

  return tokenManager.requestWithRetry<any>(requestFn);
};

// Helper function using the TokenManager class to get event type details
const getEventTypeByUri = async (eventUri: string, access_token: string, refresh_token: string): Promise<any> => {
  const tokenManager = new TokenManager(access_token, refresh_token); // Initialize TokenManager
  const requestFn = async (token: string) => {
    const response = await axios.get(
      eventUri, // Use the eventUri directly in the request URL
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  };

  return tokenManager.requestWithRetry<any>(requestFn);
};

export { getAccessToken, getUserURI, getEventTypes, getEventTypeByUri };
