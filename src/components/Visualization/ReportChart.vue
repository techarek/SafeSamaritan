<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins;

export default {
    extends: Bar,
    mixins: [reactiveProp],
    data: () => ({
        options: {
            aspectRatio: 2,
 //           responsive: true,
 //           maintainAspectRatio: false,
            scales: {
                xAxes: [{ 
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Day of Week'
                    },
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        stepSize: 1
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Reports'
                    },
                }]
            },
            legend: {
                display: true,
                position: 'top'
            }
        }
    }),
    mounted () {
        this.renderChart(this.chartData, this.options);
    },
}
</script>