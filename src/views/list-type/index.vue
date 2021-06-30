<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="100px" :inline="true">
      <el-button type="primary" @click="dialogFormVisible = !dialogFormVisible"
        >新增名单类型</el-button
      >
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable id="input_id" />
      </el-form-item>
      <el-form-item label="命名空间">
        <el-input v-model="form.namespace" placeholder="命名空间" clearable />
      </el-form-item>
      <el-form-item label="名单类型编码">
        <el-input v-model="form.code" placeholder="名单类型编码" clearable />
      </el-form-item>

      <el-form-item label="是否生效">
        <el-input v-model="form.is_valid" placeholder="是否生效" clearable />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="描述" clearable />
      </el-form-item>

      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" icon="el-icon-delete"></el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="ID" width="200" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="命名空间" width="200">
        <template slot-scope="scope">
          {{ scope.row.namespace }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="编码" width="200">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="字段列表" width="200">
        <template slot-scope="scope">
          {{ scope.row.fields }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否生效" width="200">
        <template slot-scope="scope">
          {{ scope.row.is_valid }}
        </template>
      </el-table-column>

      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template>
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="创建新的命名空间"
      :visible.sync="dialogFormVisible"
      center="true"
    >
      <el-form :model="create_form">
        <el-form-item label="命名空间" :label-width="formLabelWidth">
          <el-input v-model="create_form.namesapce" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="create_form.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字段列表" :label-width="formLabelWidth">
          <el-input v-model="create_form.fields" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="create_form.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getListTypes } from "@/api/list-type";

export default {
  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      form: {},
      currentPage4: 1,
      dialogFormVisible: false,
      create_form: {
        namespace: "",
        fields: "",
        code: "",
        description: "",
      },
      formLabelWidth: "120px",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getListTypes().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
    onSubmit() {
      this.fetchData();
    },
    handleSizeChange() {
      this.fetchData();
    },
    handleCurrentChange() {
      this.fetchData();
    },
  },
};
</script>
