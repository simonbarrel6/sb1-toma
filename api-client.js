const axios = require('axios');
const logger = require('./logger');
const config = require('./config');

class APIClient {
  constructor() {
    this.baseURL = config.API_URL;
    this.paiementURL = config.PAIEMENT_URL;
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'Dart/3.0 (dart:io)',
        'Accept-Encoding': 'gzip'
      }
    });
  }

  async login(nd, password) {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/auth/login_new`, {
        nd,
        password,
        lang: 'fr'
      });
      logger.info('✅ Login successful');
      return response.data;
    } catch (error) {
      logger.error(`❌ Login failed: ${error.message}`);
      throw error;
    }
  }

  async register(registrationData) {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/auth/register`, registrationData);
      logger.info('✅ Registration successful');
      return response.data;
    } catch (error) {
      logger.error(`❌ Registration failed: ${error.message}`);
      throw error;
    }
  }

  async confirmRegister(confirmationData) {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/auth/confirmRegister`, confirmationData);
      logger.info('✅ Registration confirmation successful');
      return response.data;
    } catch (error) {
      logger.error(`❌ Registration confirmation failed: ${error.message}`);
      throw error;
    }
  }

  async getAccountInfo(token) {
    try {
      const response = await this.axiosInstance.get(`${this.baseURL}/compte_augmentation_debit`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logger.info('✅ Account info retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error(`❌ Failed to get account info: ${error.message}`);
      throw error;
    }
  }

  async checkNdFact(nd) {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/epay/checkNdFact`, {
        nd,
        nfact: '',
        service: 'Dus'
      });
      logger.info('✅ ND Fact check successful');
      return response.data;
    } catch (error) {
      logger.error(`❌ ND Fact check failed: ${error.message}`);
      throw error;
    }
  }

  async checkNdLte(nd) {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/epay/checkNdLte`, { nd });
      logger.info('✅ ND LTE check successful');
      return response.data;
    } catch (error) {
      logger.error(`❌ ND LTE check failed: ${error.message}`);
      throw error;
    }
  }

  async useVoucherLte(nd, ncli, voucher, type1, ip = '0.0.0.0') {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/epay/voucherLte`, {
        nd,
        ncli,
        type: type1,
        voucher,
        ip
      });
      logger.info('✅ LTE voucher used successfully');
      return response.data;
    } catch (error) {
      logger.error(`❌ Failed to use LTE voucher: ${error.message}`);
      throw error;
    }
  }

  async useVoucher(nd, ncli, voucher, ip = '0.0.0.0') {
    try {
      const response = await this.axiosInstance.post(`${this.baseURL}/epay/voucherAdsl`, {
        nd,
        ncli,
        type: 'FTTH',
        voucher,
        ip
      });
      logger.info('✅ Voucher used successfully');
      return response.data;
    } catch (error) {
      logger.error(`❌ Failed to use voucher: ${error.message}`);
      throw error;
    }
  }

  async retrieveNcli(nd) {
    try {
      const response = await this.axiosInstance.post(this.paiementURL, 
        `ndco20=${nd}&validerco20=Confirmer&nfactco20=&`, {
        headers: {
          'Authorization': 'Basic VEdkNzJyOTozUjcjd2FiRHNfSGpDNzg3IQ==',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      });
      logger.info('✅ NCLI retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error(`❌ Failed to retrieve NCLI: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new APIClient();