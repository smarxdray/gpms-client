<template>
  <el-dropdown :hide-on-click="false" :show-timeout="100" trigger="click">
    <el-button plain>
      {{ hint }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-border">
      <el-radio-group v-model="noticeType" style="padding: 5px 15px;">
        <el-radio  v-for="item in showingPlatformsOptions" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-radio >
      </el-radio-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: () => 0,
      type: Number
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
        id: 0,
        name: '全体用户',
        roles: ['admin', 'teacher', 'student']
      },
      { 
        id: 1,
        name: '全体导师',
        roles: ['admin']
      },
      { 
        id: 2,
        name: '全体学生',
        roles: ['admin']
      },
      { 
        id: 3,
        name: '我的学生',
        roles: ['teacher']
      },
      {
        id: 4,
        name: '私信给管理员',
        roles: ['teacher', 'student']
      },
      { 
        id: 5,
        name: '私信给导师',
        roles: ['admin', 'student']
      },
      { 
        id: 6,
        name: '私信给学生',
        roles: ['admin', 'teacher']
      }
    ]
    let showingPlatformsOptions = allPlatformsOptions.filter(
      p => this.roles.some(r => p.roles.includes(r))
    )
    return {
      allPlatformsOptions,
      showingPlatformsOptions
    }
  },
  computed: {
    noticeType: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    hint() {
      let typeObj = this.showingPlatformsOptions.find(p => p.id == this.noticeType)
      if (!typeObj) return '请选择通知类型'
      else return typeObj.name;
    }
  }
}
</script>
