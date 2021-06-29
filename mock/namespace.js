const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    code: '@word(2, 10)',
    description: '@csentence(10, 20)'
  }]
})

module.exports = [
    {
      url: '/api/namespace',
      type: 'get',
      response: config => {
        const items = data.items
        return {
          code: 20000,
          data: {
            total: items.length,
            items: items
          }
        }
      }
    }
  ]