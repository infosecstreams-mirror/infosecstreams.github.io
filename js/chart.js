document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/active.json');
        if (!response.ok) {
            console.error('Failed to load active.json');
            return;
        }
        
        const data = await response.json();
        if (!data || !data.Streamers || data.Streamers.length === 0) return;
        
        // Take top 10 streamers for the leaderboard
        const topStreamers = data.Streamers.slice(0, 10);
        
        const labels = topStreamers.map(s => s.Name);
        const stats = topStreamers.map(s => s.ThirtyDayStats.toFixed(1));
        
        const ctx = document.getElementById('activityChart').getContext('2d');
        
        // Create a stylish gradient for the bars
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#b5e853'); // Hacker green
        gradient.addColorStop(1, '#151515');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '30-Day Activity Score',
                    data: stats,
                    backgroundColor: gradient,
                    borderColor: '#b5e853',
                    borderWidth: 1,
                    borderRadius: 4,
                    hoverBackgroundColor: '#b5e853'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#151515',
                        titleColor: '#b5e853',
                        bodyColor: '#ffffff',
                        borderColor: '#b5e853',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a3a3a3'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#b5e853',
                            font: {
                                family: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, monospace'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    } catch (error) {
        console.error('Error rendering chart:', error);
    }
});
