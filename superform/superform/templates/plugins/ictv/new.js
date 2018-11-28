Vue.component('slide', {
    data() {
        return {
            title: '',
            subtitle: '',
            text: '',
            backgroundColor: '',
            duration: 1000
        }
    },
    props: {
        channel: {
            required: true,
            type: String,
            trim: true
        },
        id: {
            required: true,
            type: Number
        }
    },
    computed: {
        getChannelId() {
            return this.channel + '_' + this.id + '_'
        },
        getChannel() {
            return `Slide n°${this.id}`
        }
    },
    template: `
    <div>
        <h4 v-html="getChannel"></h4>

        <div class="form-group">
            <label>
                Title<br>
            </label>
            <input class="form-control" :name="getChannelId + 'title'" :id="getChannelId + 'title'"
                   v-model="title" type="text" required>
        </div>

        <div class="form-group">
            <label>
                Subtitle<br>
            </label>
                <input class="form-control" :name="getChannelId + 'subtitle'" :id="getChannelId + 'subtitle'"
                       v-model="subtitle"
                       type="text" required>
        </div>

        <div class="form-group">
            <label>
                Text<br>
            </label>
                <textarea rows="5" class="form-control" :name="getChannelId + 'text'" :id="getChannelId + 'text'"
                       v-model="text"
                       type="text" required></textarea>
        </div>

        <div class="form-group">
            <label>
                Logo<br>
            </label>
                <input :name="getChannelId + 'logo'" :id="getChannelId + 'logo'"
                       class="form-control"
                       type="text">
        </div>

        <div class="form-group">
            <label>
                Image<br>
            </label>
                <input :name="getChannelId + 'image'" :id="getChannelId + 'image'"
                       class="form-control"
                       type="text">
        </div>

        <div class="form-group">
            <label>
                Background color<br>
            </label>
                <input class="form-control" :name="getChannelId + 'background-color'"
                       :id="getChannelId + 'background-color'"
                       v-model="backgroundColor"
                       type="text">
        </div>

        <div class="form-group">
            <label>
                Duration<br>
            </label>
                <input class="form-control" :name="getChannelId + 'duration'" :id="getChannelId + 'duration'"
                       v-model="duration"
                       type="number">
        </div>
    </div>
  `
});

Vue.component('slides', {
    props: {
        channel: {
            type: String,
            required: true,
            trim: true
        }
    },
    data() {
        return {
            nbSlides: 1,
            nbMaxSlides: 5
        }
    },
    methods: {
        addSlide() {
            if (this.nbSlides === this.nbMaxSlides) {
                alert(`You can't create more than ${this.nbMaxSlides} slides`)
            } else {
                this.nbSlides++;
            }
        },
        removeSlide() {
            if (this.nbSlides === 1) {
                alert("You must at least fill one slide !");
            } else {
                this.nbSlides--;
            }
        }
    },
    computed: {
        getCounter() {
            return `${this.nbSlides}/${this.nbMaxSlides}`
        }
    },
    template: `
    <div>
    <transition-group name="fade">
        <slide v-for="i in nbSlides" :channel="channel" :id="i" :key="i"></slide>
</transition-group>


        <div v-html="getCounter"></div>

        <button type="button" @click="addSlide">
            Add
        </button>

        <button type="button" @click="removeSlide">
            Remove
        </button>
    </div>
    `
});

vm = new Vue({
    el: "#ictv"
});