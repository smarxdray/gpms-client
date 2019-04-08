<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      发送给({{ platforms.length }})
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-checkbox-group v-model="platforms" style="padding: 5px 15px;">
        <el-checkbox v-for="item in platformsOptions" :key="item.key" :label="item.key">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: () => [],
      type: Array
    },
    roles: {
      required: true,
      default: () => [],
      type: Array
    }
  },
  data() {
    let allPlatformsOptions = [
      { 
        key: 'to-admin',
        name: '管理员',
        roles: ['teacher', 'student']
      },
      { 
        key: 'to-all-teachers',
        name: '全体导师',
        roles: ['admin']
      },
      { 
        key: 'to-all-students',
        name: '全体学生',
        roles: ['admin']
      },
      { 
        key: 'to-my-students',
        name: '我的学生',
        roles: ['teacher']
      },
      {
        key: 'to-a-teacher',
        name: '导师私信',
        roles: ['admin', 'student']
      },
      { 
        key: 'to-a-student',
        name: '学生私信',
        roles: ['admin', 'teacher']
      }
    ]
    let platformsOptions = allPlatformsOptions.filter(
      p => this.roles.some(r => p.roles.includes(r))
    )
    return {
      platformsOptions
    }
  },
  computed: {
    platforms: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
