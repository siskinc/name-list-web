<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="ID" :label-width="formLabelWidth" v-show="show.id">
        <el-input v-model="form.id" autocomplete="off" :disabled="disabled.id"></el-input>
      </el-form-item>
      <el-form-item label="命名空间" :label-width="formLabelWidth">
        <el-select
          v-model="form.namespace"
          placeholder="请选择命名空间"
          :disabled="disabled.namespace"
        >
          <el-option
            v-for="code in namespaceCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码" :label-width="formLabelWidth">
        <el-input
          v-model="form.code"
          autocomplete="off"
          :disabled="disabled.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="字段列表" :label-width="formLabelWidth">
        <el-select
          v-model="form.fields"
          multiple
          clearable
          allow-create
          filterable
          default-first-option
          placeholder="请输入字段列表"
          :disabled="disabled.fields"
        >
          <el-option
            v-for="item in fieldInfoList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否生效" :label-width="formLabelWidth">
        <el-select v-model="form.is_valid" placeholder="请选择是否生效">
          <el-option label="生效" value="true"></el-option>
          <el-option label="失效" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.description"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "创建",
      formLabelWidth: "120px",
      fieldInfoList: [],
      show: {
        id: false,
      },
      disabled: {
        namespace: false,
        code: false,
        fields: false,
      },
    };
  },
  props: {
    namespaceCodeList: {
      type: Array,
      default: [],
    },
    form: {
      type: Object,
      default: {},
    },
    dialogType: {
      type: String,
      default: "create",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    dialogChange() {
      switch (this.dialogType) {
        case "create":
          this.title = "创建新的名单列表";
          this.show.id = false;
          this.disabled.id = true;
          this.disabled.namespace = false;
          this.disabled.code = false;
          this.disabled.fields = false;
          break;
        case "update":
          this.title = "修改名单列表";
          this.show.id = true;
          this.disabled.id = true;
          this.disabled.namespace = true;
          this.disabled.code = true;
          this.disabled.fields = true;
        default:
          break;
      }
    },
    initData() {
      this.form.fields.forEach((element) => {
        this.fieldInfoList.push({
          value: element,
          label: element,
        });
      });
    },
  },
  watch: {
    dialogType() {
      this.dialogChange();
    },
  },
  created() {
    this.dialogChange();
  },
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