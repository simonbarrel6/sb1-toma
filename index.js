const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const logger = require('./logger');
const apiClient = require('./api-client');
const { formatters } = require('./formatters');

// Create bot instance
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// Store user states
const userStates = new Map();
const userContext = new Map();

// Command handlers
bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    userStates.set(chatId, config.STATES.MAIN_MENU);
    
    const welcomeMessage = '🌟 *مرحبا بك في بوت الجزائر تيليكوم!*\n\nيرجى اختيار أحد الخيارات التالية:';
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔑 تسجيل الدخول', callback_data: 'login' },
          { text: '📝 تسجيل', callback_data: 'register' }
        ],
        [
          { text: '📊 تحقق من الفواتير', callback_data: 'nd_fact' },
          { text: '💳 شحن adsl عبر القسيمة', callback_data: 'recharge_voucher' }
        ],
        [
          { text: '📡 شحن LTE عبر القسيمة', callback_data: 'recharge_voucher_lte' },
          { text: '🔍 الحصول على رقم الزبون', callback_data: 'get_ncli' }
        ]
      ]
    };

    await bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  } catch (error) {
    logger.error(`Start command error: ${error.message}`);
    await handleError(msg.chat.id);
  }
});

// Callback query handler
bot.on('callback_query', async (query) => {
  try {
    const chatId = query.message.chat.id;
    const action = query.data;

    switch (action) {
      case 'login':
        await handleLoginSelected(chatId);
        break;
      case 'register':
        await handleRegisterSelected(chatId);
        break;
      case 'nd_fact':
        await handleNdFactSelected(chatId);
        break;
      case 'recharge_voucher':
        await handleRechargeVoucherSelected(chatId);
        break;
      case 'recharge_voucher_lte':
        await handleRechargeVoucherLteSelected(chatId);
        break;
      case 'get_ncli':
        await handleGetNcliSelected(chatId);
        break;
      case 'account_info':
        await handleAccountInfoCallback(chatId);
        break;
      case 'logout':
        await handleLogoutCallback(chatId);
        break;
      case 'main_menu':
        await handleMainMenu(chatId);
        break;
    }

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    logger.error(`Callback query error: ${error.message}`);
    await handleError(query.message.chat.id);
  }
});

// Message handler
bot.on('message', async (msg) => {
  try {
    if (msg.text && !msg.text.startsWith('/')) {
      const chatId = msg.chat.id;
      const state = userStates.get(chatId);
      const text = msg.text.trim();

      switch (state) {
        case config.STATES.LOGIN_ND:
          await handleLoginNdInput(chatId, text);
          break;
        case config.STATES.LOGIN_PASSWORD:
          await handleLoginPasswordInput(chatId, text);
          break;
        // Add other state handlers here
      }
    }
  } catch (error) {
    logger.error(`Message handler error: ${error.message}`);
    await handleError(msg.chat.id);
  }
});

// Error handler
async function handleError(chatId) {
  await bot.sendMessage(chatId, '❌ *حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.*', {
    parse_mode: 'Markdown'
  });
}

// Start the bot
logger.info('🚀 Bot started successfully');