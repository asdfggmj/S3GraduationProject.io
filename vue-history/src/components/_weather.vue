<!-- 天气组件 -->
<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">{{ error }}</div>
  <el-text v-else
    >当前在：{{ city }}，今日天气：{{ weather }}，温度为：{{ temperature }}℃， {{ windPower }}级{{
      windDirection
    }}风
  </el-text>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 高德 API Key
const API_KEY = '318d6e64adc9c16f6dab3879b6cee04c'

const city = ref('')
const weather = ref('')
const temperature = ref('')
const windDirection = ref('')
const windPower = ref('')
const loading = ref(true)
const error = ref('')

// 方式 1：根据 IP 获取用户所在城市的天气
const getWeatherByCity = async () => {
  try {
    // 1. 先获取用户所在城市编码
    const cityResponse = await axios.get(`https://restapi.amap.com/v3/ip?key=${API_KEY}`)
    const adcode = cityResponse.data.adcode // 城市编码
    if (!adcode) {
      throw new Error('无法获取城市编码')
    }
    city.value = cityResponse.data.city

    // 2. 再根据城市编码获取天气数据
    const weatherResponse = await axios.get(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${API_KEY}&city=${adcode}`,
    )

    if (weatherResponse.data.status !== '1') {
      throw new Error(weatherResponse.data.info || '获取天气信息失败')
    }

    // 解析天气数据
    const weatherData = weatherResponse.data.lives[0]
    weather.value = weatherData.weather || '暂无天气数据'
    temperature.value = weatherData.temperature || 'N/A'
    windDirection.value = weatherData.winddirection || 'N/A'
    windPower.value = weatherData.windpower || 'N/A'
  } catch (err) {
    error.value = `获取天气数据失败：${err.message || err.response?.data?.info}`
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 组件加载后获取天气信息
onMounted(() => {
  getWeatherByCity()
})
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}
</style>
