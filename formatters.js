const formatters = {
  accountInfo: (data) => {
    return (
      '📋 *معلومات الحساب*:\n\n' +
      `👤 *الاسم:* ${data.prenom || ''} ${data.nom || ''}\n` +
      `📞 *رقم الهاتف:* ${data.nd || ''}\n` +
      `📍 *العنوان:* ${data.adresse || ''}\n` +
      `📦 *العرض:* ${data.offre || ''}\n` +
      `⚡ *السرعة:* ${data.speed || ''} Mbps\n` +
      `💰 *الرصيد:* ${data.credit || '0'} DA\n` +
      `📅 *عدد الأيام المتبقية:* ${data.balance || '0'} يوم\n` +
      `📆 *تاريخ الانتهاء:* ${data.dateexp || ''}\n` +
      `📱 *الهاتف المحمول:* ${data.mobile || ''}\n` +
      `📧 *البريد الإلكتروني:* ${data.email || ''}\n` +
      `🔢 *رقم الزبون:* ${data.ncli || ''}\n` +
      `📊 *الحالة:* ${data.status || ''}\n` +
      `📝 *النوع:* ${data.type1 || ''}`
    );
  },

  ndFactInfo: (data) => {
    return (
      '📋 *معلومات الرقم*:\n\n' +
      `📞 *الرقم:* ${data.INFO?.nd || ''}\n` +
      `💰 *الرصيد:* ${data.INFO?.credit || '0'} DA`
    );
  },

  voucherResponse: (response) => {
    const code = response.code;
    const message = response.message;
    if (code === '0') {
      return `✅ *تم شحن الرصيد بنجاح!*\n🎫 *الكود:* ${message}`;
    }
    return `❌ *فشل في شحن الرصيد.*\n🔢 *رمز الخطأ:* ${code}\n📝 *الرسالة:* ${message}`;
  },

  ncliResponse: (ncli) => {
    return `🔢 *رقم الزبون:* ${ncli}`;
  },

  registerResponse: (response) => {
    if (response.code === '0' || response.code === '1' || response.code === '5') {
      return '✅ *تم التسجيل بنجاح!*\n📱 يرجى إدخال رمز التحقق (OTP) الذي تلقيته لتأكيد التسجيل.';
    }
    return `❌ ${response.message || 'فشل في التسجيل.'}`;
  },

  confirmRegisterResponse: (response) => {
    if (response.meta_data?.original?.token) {
      return '✅ *تم تأكيد التسجيل بنجاح!*\nيمكنك الآن تسجيل الدخول باستخدام خيار تسجيل الدخول.';
    }
    return `❌ ${response.message || 'فشل تأكيد التسجيل. يرجى المحاولة مرة أخرى.'}`;
  }
};

module.exports = { formatters };