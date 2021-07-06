<template>
  <el-dialog title="名单命中" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item
        label="数据[JSON]"
        :label-width="formLabelWidth"
        prop="data"
      >
        <el-input
          type="textarea"
          v-model="form.data"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>


<script>
import { hitOneListItem, hitAllListItem } from "@/api/list-item";
export default {
  props: {
    list_item_id: {
      type: String,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    namespace: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        data: "",
      },
      formLabelWidth: "180px",
    };
  },
  methods: {
    onSubmit() {
      console.log(`this.list_item_id: ${this.list_item_id}`);
      let data = {
        data: this.form.data,
      };
      if (this.list_item_id !== "") {
        data.list_item_id = this.list_item_id;
        hitOneListItem(data).then((response) => {
          let resp_data = response.data;
          if (resp_data.hit) {
            this.$message.success(resp_data.resource);
          } else {
            this.$message.warning(resp_data.resource);
          }
        });
      } else {
        data.namespace = this.namespace;
        hitAllListItem(data).then((response) => {
          let hit_list_item_list = response.data.hit_list_item_list;
          if (hit_list_item_list == null || hit_list_item_list.length < 0) {
            this.$message.warning("无命中");
          } else {
            for (let i = 0; i < hit_list_item_list.length; i++) {
              let item = hit_list_item_list[i];
              this.$message.success(`命中名单: ${item.id}`);
            }
          }
        });
      }
    },
  },
  created() {},
  computed: {
    dialogFormVisible: {
      get: function () {
        return this.visible;
      },
      set: function () {
        this.$emit("closeDialog");
      },
    },
  },
};
</script>