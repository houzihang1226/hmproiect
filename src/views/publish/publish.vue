<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改':'发布'}}文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form ref="form" label-width="120px">
        <el-form-item label="标题:">
          <el-input v-model="pufab.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容:">
          <quill-editor v-model="pufab.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:">
          <el-radio-group v-model="pufab.cover.type" @change="pufab.cover.images=[]">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
            <!-- 素材图片 -->
            <div v-if="pufab.cover.type===1">
              <my-image v-model="pufab.cover.images[0]"></my-image>
            </div>
            <div v-if="pufab.cover.type===3">
              <my-image v-for="i in 3" :key="i" v-model="pufab.cover.images[i-1]"></my-image>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:">
          <my-channel v-model="pufab.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="success" @click="revise(false)">修改</el-button>
          <el-button @click="revise(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="create(false)">发表</el-button>
          <el-button @click="create(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// eslint-disable-next-line semi
import 'quill/dist/quill.core.css';
// eslint-disable-next-line semi
import 'quill/dist/quill.snow.css';
// eslint-disable-next-line semi
import 'quill/dist/quill.bubble.css';
// eslint-disable-next-line semi
import { quillEditor } from 'vue-quill-editor';
export default {
  data () {
    return {
      pufab: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  components: {
    quillEditor
  },
  watch: {
    '$route.query.id': function () {
      const articl = this.$route.query.id
      if (articl) {
        this.getPost(articl)
      } else {
        this.pufab = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        }
      }
    }
  },
  created () {
    //  判断是否为修改
    const articl = this.$route.query.id
    if (articl) {
      this.getPost(articl)
    }
  },
  methods: {
    async getPost (id) {
      // 获取要修改的内容
      const {
        data: { data }
      } = await this.$http.get('articles/' + id)
      // 填充内容
      this.pufab = data
      console.log(this.pufab)
    },
    async create (draft) {
      if (!this.pufab.title) {
        return this.$message.warning('请确保标题填写')
      } else if (!this.pufab.content) {
        return this.$message.warning('请确保内容填写')
      } else if (this.pufab.channel_id === null) {
        return this.$message.warning('不选类型你学个锤子')
      } else {
        await this.$http.post(`articles?draft=${draft}`, this.pufab)
        this.$message.success(draft ? '存入草稿成功' : '发表成功')
        this.$router.push('/article')
      }
    },
    async revise (draft) {
      if (!this.pufab.title) {
        return this.$message.warning('请确保标题填写')
      } else if (!this.pufab.content) {
        return this.$message.warning('请确保内容填写')
      } else if (this.pufab.channel_id === null) {
        return this.$message.warning('不选类型你学个锤子')
      } else {
        await this.$http.put(
          `articles/${this.pufab.id}?draft=${draft}`,
          this.pufab
        )
        this.$message.success(draft ? '存入草稿成功' : '修改成功')
        this.$router.push('/article')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.el-radio {
  margin-top: 13px;
}
</style>
