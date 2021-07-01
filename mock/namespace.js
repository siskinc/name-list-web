const Mock = require('mockjs')

const data = Mock.mock({
  'items|10': [{
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
          code: 0,
          total: items.length,
          data: items
        }
      }
    },
    {
      url: '/api/namespace',
      type: 'get',
      response: config => {
        return {
          code: 0
        }
      }
    }
  ]