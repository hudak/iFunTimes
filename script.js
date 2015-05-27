var millsPerDay = 1000 * 60 * 60 * 24;
var daysPerSeason = 91;
var interval = 8;

angular
  .module('beachApp', ['ngMaterial'])
  .factory('beachWeek', function() {
    var epoch = new Date("Dec 30, 2005 EST").getTime();
    var now = Date.now();
    return {
      current: function() {
        var n = Math.floor((now - epoch) / millsPerDay / daysPerSeason);
        var beachWeek = this.create(n);
        while (beachWeek.getEnd() < now) {
          beachWeek.n += 1;
        }
        return beachWeek;
      },
      next: function() {
        var beachWeek = this.current();
        while (beachWeek.getStart() < now) {
          beachWeek.n += 1;
        }
        return beachWeek;
      },
      create: function(n) {
        var factory = this;
        return {
          n: n,
          getStart: function() {
            var rotation = Math.floor(this.n / 4 + interval) % 13;
            return new Date(
              epoch +
              (this.n * daysPerSeason + rotation * 7) * millsPerDay
            )
          },
          getEnd: function() {
            return new Date(this.getStart().getTime() + 7 * millsPerDay);
          }
        }
      }
    }
  })
  .directive('bwDateRange', function() {
    return {
      restrict: 'A',
      scope: {
        bwDateRange: '='
      },
      template: '{{bwDateRange.getStart() | date: mediumDate}} - ' +
        '{{bwDateRange.getEnd() | date: mediumDate}}'
    }
  })
  .controller('BeachCountDown', ['$scope', 'beachWeek', function(scope, beachWeek) {
    scope.current = beachWeek.current();
    scope.countDown = Math.round(
      (scope.current.getStart().getTime() - Date.now()) / millsPerDay
    )
  }])
  .controller('BeachCalendar', ['$scope', 'beachWeek', function(scope, beachWeek) {
    scope.year = Math.floor(beachWeek.current().n / 4) + 2006;
    scope.$watch('year', function() {
      scope.weeks = [];
      for (var i = 0; i < 4 && scope.year >= 2006; i++) {
        scope.weeks.push(
          beachWeek.create((scope.year - 2006) * 4 + i)
        );
      }
    });
  }]);