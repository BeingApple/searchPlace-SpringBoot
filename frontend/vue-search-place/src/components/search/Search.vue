<template>
  <common>
    <h2 class="mt-2">장소 검색</h2>
    <p class="lead">
      <b-input-group prepend="키워드" class="mt-3">
        <b-form-input v-model="keyword" v-on:keyup.enter="search(true)"></b-form-input>
        <b-input-group-append>
          <b-button variant="info" v-on:click.prevent="search(true)">검색</b-button>
        </b-input-group-append>
      </b-input-group>
      <b-list-group class="mt-2">
        <b-list-group-item v-if="!searchList.documents" >검색 결과가 없습니다.</b-list-group-item>
        <b-list-group-item v-on:click.prevent="move(item.id, index)" v-for="(item, index) in searchList.documents" v-bind:key="item.id" >
          {{item.place_name}}
        </b-list-group-item>
      </b-list-group>
    </p>

    <nav aria-label="Page navigation example" v-if="searchList.documents">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" v-on:click.prevent="pageMove(1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <li class="page-item" v-bind:class="nowPageActive(pageNumber)" v-for="pageNumber in pageList" v-bind:key="pageNumber" ><a class="page-link" v-on:click.prevent="pageMove(pageNumber)">{{pageNumber}}</a></li>

        <li class="page-item">
          <a class="page-link" v-on:click.prevent="pageMove(pageSize)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </common>
</template>

<script>
import service from '@/service'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Search',
  data () {
    return {
      keyword: '',
      nowKeyword: '',
      page: 1,
      nowPage: 1,
      size: 15,
      perPage: 5,
      searchList: []
    }
  },
  methods: {
    ...mapActions(['setData', 'setKeyword', 'setSearchViewBack']),
    async search (reset) {
      if (reset) this.page = 1

      if (this.page !== this.nowPage || this.nowKeyword !== this.keyword) {
        try {
          let searchResult = await service.search(this.keyword, this.page, this.size)
          if (searchResult.status === 200) {
            this.nowKeyword = this.keyword
            this.nowPage = this.page
            this.searchList = searchResult.data
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    pageMove (pageNum) {
      this.page = pageNum
      this.search(false)
    },
    nowPageActive (nowPage) {
      let list = []
      if (nowPage === this.page) {
        list.push('active')
      }

      return list
    },
    async move (id, index) {
      // vuex action
      await this.setData(this.searchList.documents[index])
      this.setKeyword(this.keyword)

      this.$router.push('/search/' + id)
    }
  },
  mounted () {
    if (this.saveKeyword !== '' && this.getBack) {
      this.keyword = this.saveKeyword
      this.search(true)
    }
    this.setKeyword('')
    this.setSearchViewBack(false)
  },
  computed: {
    pageSize: function () {
      return Math.ceil(this.searchList.meta.pageable_count / this.size)
    },
    pageList: function () {
      let list = []
      let divide = Math.floor(this.perPage / 2)

      if (this.pageSize > this.perPage) {
        if (this.page <= (divide + 1)) {
          for (let i = 1; i <= this.perPage; i++) list.push(i)
        } else if (this.page > (this.pageSize - divide)) {
          for (let i = this.pageSize - (this.perPage - 1); i <= this.pageSize; i++) list.push(i)
        } else {
          for (let i = this.page - divide; i <= this.page + divide; i++) list.push(i)
        }
      } else {
        for (let i = 1; i <= this.pageSize; i++) list.push(i)
      }
      return list
    },
    ...mapGetters({
      saveKeyword: 'getKeyword',
      getBack: 'getSearchViewBack'
    })
  }
}
</script>

<style scoped>
</style>
