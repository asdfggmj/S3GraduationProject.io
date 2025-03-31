import { defineStore } from "pinia";
import http from "@/http";
import { useUserStore } from '@/stores/user' // 确保正确导入 useUserStore

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menuData: [], // 菜单数据
    loading: false, // 加载状态
  }),
  actions: {
    // 获取菜单数据（供 system_menu.vue 和 Aside.vue 共用）
    async getMenus() {
      const userStore = useUserStore(); // 调用 useUserStore
      const userData = userStore.getUser;

      if (!userData) {
        console.log("用户不存在或未加载成功");
        return;
      }
      const response = await http.get("/menu/getUserMenus");
      this.menuData = response.data.data || []; // 使用 this.menuData 更新状态
    },
  },
});
