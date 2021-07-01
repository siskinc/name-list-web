const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    namespace: '@word(2, 10)',
    code: '@word(2, 10)',
    "fields|1-3": '@word(2,10)',
    "is_valid|1": true,
    description: '@csentence(10, 20)'
  }]
})

module.exports = [
    {
      url: '/api/list-type',
      type: 'get',
      response: config => {
        const items = data.items
        return {
          code: 0,
          data: {
            total: items.length,
            items: items
          }
        }
      }
    }
  ]