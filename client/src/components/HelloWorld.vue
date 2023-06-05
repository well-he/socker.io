<template>
  <div>
    <h2>{{ statusText }}</h2>
    <table width="300" border="1" align="center" v-table-click="state">
      <thead>
        <th>ID</th>
        <th>Name</th>
        <th>Age</th>
        <th>Score</th>
      </thead>
      <tbody>
        <tr v-for="(user, index) in state.userList" :key="user.id">
          <td>{{ user.id }}</td>
          <td :data-index="index" data-field="name">
            <span>{{ user.name }}</span>
          </td>
          <td :data-index="index" data-field="age">
            <span>{{ user.age }}</span>
          </td>
          <td :data-index="index" data-field="score">
            <span>{{ user.score }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'
import { reactive, computed } from 'vue';
import vTableClick from '../directives/TableClick.js'

const socket = io('http://localhost:3000')
const state = reactive({
  userList: [],
  status: false,
  field: '',
  index: -1,
  socket
})

socket.on('getUser', data => {
  state.userList = data;
})

socket.on('changeStates', status => {
  state.status = status;
})
socket.on('changeData', ({ field, index, value }) => {
  state.userList = state.userList.map((item, idx) => {
    if (idx === parseInt(index)) {
      item[field] = value;
    }
    return item;
  })
})
const statusText = computed(() => state.status ? '正在修改中...' : '')
</script>

<style>
td {
  position: relative;
}
</style>